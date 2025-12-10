create type "public"."cash_shift_status" as enum ('open', 'closed', 'auto_closed');

create table "public"."cash_shifts" (
    "id" uuid not null default gen_random_uuid(),
    "shop_id" uuid not null,
    "shift_date" date not null,
    "shift_number" integer not null,
    "opened_at" timestamp with time zone not null default now(),
    "opened_by" uuid,
    "closes_at" timestamp with time zone not null default (now() + '24:00:00'::interval),
    "closed_at" timestamp with time zone,
    "closed_by" uuid,
    "closing_cash" numeric,
    "closing_banks" jsonb default '{}'::jsonb,
    "status" cash_shift_status not null default 'open'::cash_shift_status,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."cash_shifts" enable row level security;

alter table "public"."cash_register" add column "shift_id" uuid;

alter table "public"."shops" add column "created_at" timestamp with time zone not null default now();

CREATE INDEX cash_register_shift_idx ON public.cash_register USING btree (shift_id);

CREATE UNIQUE INDEX cash_shifts_pkey ON public.cash_shifts USING btree (id);

CREATE UNIQUE INDEX cash_shifts_shop_date_idx ON public.cash_shifts USING btree (shop_id, shift_date, shift_number);

CREATE INDEX cash_shifts_status_idx ON public.cash_shifts USING btree (status);

alter table "public"."cash_shifts" add constraint "cash_shifts_pkey" PRIMARY KEY using index "cash_shifts_pkey";

alter table "public"."cash_register" add constraint "cash_register_shift_id_fkey" FOREIGN KEY (shift_id) REFERENCES cash_shifts(id) not valid;

alter table "public"."cash_register" validate constraint "cash_register_shift_id_fkey";

alter table "public"."cash_shifts" add constraint "cash_shifts_closed_by_fkey" FOREIGN KEY (closed_by) REFERENCES profiles(id) not valid;

alter table "public"."cash_shifts" validate constraint "cash_shifts_closed_by_fkey";

alter table "public"."cash_shifts" add constraint "cash_shifts_opened_by_fkey" FOREIGN KEY (opened_by) REFERENCES profiles(id) not valid;

alter table "public"."cash_shifts" validate constraint "cash_shifts_opened_by_fkey";

alter table "public"."cash_shifts" add constraint "cash_shifts_shop_id_fkey" FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE not valid;

alter table "public"."cash_shifts" validate constraint "cash_shifts_shop_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.add_shift_cash_register(p_type transaction_type, p_amount numeric, p_bank_name text, p_from text)
 RETURNS cash_register
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  v_shift public.cash_shifts;
  v_entry public.cash_register;
BEGIN
  v_shift := public.get_or_create_open_shift();

  INSERT INTO public.cash_register (type, amount, bank_name, "from", shop_id, added_by, shift_id)
  VALUES (
    p_type,
    p_amount,
    p_bank_name,
    p_from,
    public.current_shop_id(),
    (SELECT full_name FROM public.profiles WHERE id = auth.uid()),
    v_shift.id
  )
  RETURNING * INTO v_entry;

  RETURN v_entry;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.attach_entry_to_shift(entry_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  v_shift public.cash_shifts;
BEGIN
  v_shift := public.get_or_create_open_shift();

  UPDATE public.cash_register
     SET shift_id = v_shift.id
   WHERE id = entry_id
     AND shift_id IS DISTINCT FROM v_shift.id;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.auto_close_cash_shifts()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  rec record;
  v_bank_summary jsonb;
BEGIN
  FOR rec IN
    SELECT *
      FROM public.cash_shifts
     WHERE status = 'open'
       AND closes_at <= now()
  LOOP
    SELECT jsonb_object_agg(bank_name, total)
      INTO v_bank_summary
      FROM (
        SELECT COALESCE(bank_name, 'other') AS bank_name, SUM(amount) AS total
          FROM public.cash_register
         WHERE shift_id = rec.id
           AND type = 'bank_transfer'
         GROUP BY 1
      ) t;

    UPDATE public.cash_shifts
       SET status = 'auto_closed',
           closed_at = now(),
           closing_cash = COALESCE(closing_cash, 0),
           closing_banks = COALESCE(v_bank_summary, '{}'::jsonb),
           updated_at = now()
     WHERE id = rec.id;
  END LOOP;
END;
$function$
;

create or replace view "public"."cash_shift_dashboard" as  SELECT s.shop_id,
    s.id AS shift_id,
    s.shift_number,
    s.status,
    s.opened_at,
    s.closes_at,
    s.closed_at,
    s.closing_cash,
    s.closing_banks,
    COALESCE(cash.cash_total, (0)::numeric) AS cash_total,
    COALESCE(bank.bank_total, (0)::numeric) AS bank_total
   FROM ((cash_shifts s
     LEFT JOIN ( SELECT cash_register.shift_id,
            sum(cash_register.amount) AS cash_total
           FROM cash_register
          WHERE (cash_register.type = 'cash'::transaction_type)
          GROUP BY cash_register.shift_id) cash ON ((cash.shift_id = s.id)))
     LEFT JOIN ( SELECT cash_register.shift_id,
            sum(cash_register.amount) AS bank_total
           FROM cash_register
          WHERE (cash_register.type = 'bank_transfer'::transaction_type)
          GROUP BY cash_register.shift_id) bank ON ((bank.shift_id = s.id)));


CREATE OR REPLACE FUNCTION public.close_cash_shift(p_shift_id uuid, p_cash_amount numeric, p_comment jsonb DEFAULT '{}'::jsonb)
 RETURNS cash_shifts
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  v_shift public.cash_shifts;
  v_shop_id uuid;
  v_bank_summary jsonb;
BEGIN
  SELECT * INTO v_shift FROM public.cash_shifts WHERE id = p_shift_id FOR UPDATE;
  IF v_shift.id IS NULL THEN
    RAISE EXCEPTION 'Shift not found';
  END IF;

  v_shop_id := public.current_shop_id();
  IF v_shift.shop_id <> v_shop_id THEN
    RAISE EXCEPTION 'Forbidden';
  END IF;

  SELECT jsonb_object_agg(bank_name, total)
    INTO v_bank_summary
    FROM (
      SELECT COALESCE(bank_name, 'other') AS bank_name, SUM(amount) AS total
        FROM public.cash_register
       WHERE shift_id = v_shift.id
         AND type = 'bank_transfer'
       GROUP BY 1
    ) t;

  UPDATE public.cash_shifts
     SET status = 'closed',
         closed_at = now(),
         closed_by = auth.uid(),
         closing_cash = p_cash_amount,
         closing_banks = COALESCE(v_bank_summary, '{}'::jsonb),
         updated_at = now()
   WHERE id = v_shift.id;

  RETURN (SELECT * FROM public.cash_shifts WHERE id = v_shift.id);
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_or_create_open_shift()
 RETURNS cash_shifts
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  v_shop_id uuid;
  v_today date := (now() AT TIME ZONE 'Asia/Almaty')::date;
  v_shift public.cash_shifts;
  v_next_number integer;
BEGIN
  v_shop_id := public.current_shop_id();

  SELECT *
    INTO v_shift
    FROM public.cash_shifts
   WHERE shop_id = v_shop_id
     AND status = 'open'
   ORDER BY opened_at DESC
   LIMIT 1;

  IF v_shift.id IS NOT NULL THEN
    RETURN v_shift;
  END IF;

  SELECT COALESCE(MAX(shift_number), 0) + 1
    INTO v_next_number
    FROM public.cash_shifts
   WHERE shop_id = v_shop_id
     AND shift_date = v_today;

  INSERT INTO public.cash_shifts (shop_id, shift_date, shift_number, opened_at, opened_by)
  VALUES (v_shop_id, v_today, v_next_number, now(), auth.uid())
  RETURNING * INTO v_shift;

  RETURN v_shift;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.current_shop_id()
 RETURNS uuid
 LANGUAGE sql
 SECURITY DEFINER
AS $function$
  SELECT shop_id FROM public.profiles WHERE id = auth.uid();
$function$
;

grant delete on table "public"."cash_shifts" to "anon";

grant insert on table "public"."cash_shifts" to "anon";

grant references on table "public"."cash_shifts" to "anon";

grant select on table "public"."cash_shifts" to "anon";

grant trigger on table "public"."cash_shifts" to "anon";

grant truncate on table "public"."cash_shifts" to "anon";

grant update on table "public"."cash_shifts" to "anon";

grant delete on table "public"."cash_shifts" to "authenticated";

grant insert on table "public"."cash_shifts" to "authenticated";

grant references on table "public"."cash_shifts" to "authenticated";

grant select on table "public"."cash_shifts" to "authenticated";

grant trigger on table "public"."cash_shifts" to "authenticated";

grant truncate on table "public"."cash_shifts" to "authenticated";

grant update on table "public"."cash_shifts" to "authenticated";

grant delete on table "public"."cash_shifts" to "service_role";

grant insert on table "public"."cash_shifts" to "service_role";

grant references on table "public"."cash_shifts" to "service_role";

grant select on table "public"."cash_shifts" to "service_role";

grant trigger on table "public"."cash_shifts" to "service_role";

grant truncate on table "public"."cash_shifts" to "service_role";

grant update on table "public"."cash_shifts" to "service_role";

create policy "cash_shifts_mod"
on "public"."cash_shifts"
as permissive
for update
to public
using ((shop_id = current_shop_id()));


create policy "cash_shifts_select"
on "public"."cash_shifts"
as permissive
for select
to public
using ((shop_id = current_shop_id()));


create policy "delete_cash_shifts_for_shop"
on "public"."cash_shifts"
as permissive
for delete
to public
using ((shop_id = ( SELECT profiles.shop_id
   FROM profiles
  WHERE (profiles.id = auth.uid()))));


create policy "insert_cash_shifts_for_shop"
on "public"."cash_shifts"
as permissive
for insert
to public
with check ((shop_id = ( SELECT profiles.shop_id
   FROM profiles
  WHERE (profiles.id = auth.uid()))));


create policy "select_cash_shifts_by_shop"
on "public"."cash_shifts"
as permissive
for select
to public
using ((shop_id = ( SELECT profiles.shop_id
   FROM profiles
  WHERE (profiles.id = auth.uid()))));


create policy "update_cash_shifts_for_shop"
on "public"."cash_shifts"
as permissive
for update
to public
using ((shop_id = ( SELECT profiles.shop_id
   FROM profiles
  WHERE (profiles.id = auth.uid()))))
with check ((shop_id = ( SELECT profiles.shop_id
   FROM profiles
  WHERE (profiles.id = auth.uid()))));



