alter table "public"."cash_shifts" drop constraint "cash_shifts_closed_by_fkey";

alter table "public"."cash_shifts" drop constraint "cash_shifts_opened_by_fkey";

drop function if exists "public"."close_cash_shift"(p_shift_id uuid, p_cash_amount numeric, p_comment jsonb);

drop view if exists "public"."cash_shift_dashboard";

alter table "public"."cash_shifts" alter column "closed_by" set data type text using "closed_by"::text;

alter table "public"."cash_shifts" alter column "opened_by" set data type text using "opened_by"::text;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.close_cash_shift(p_shift_id uuid, p_cash_amount numeric, p_closed_by_name text DEFAULT NULL::text, p_comment jsonb DEFAULT '{}'::jsonb)
 RETURNS cash_shifts
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  v_shift public.cash_shifts;
  v_shop_id uuid;
  v_bank_summary jsonb;
  v_closed_by_name text;
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

  -- Use provided name or fallback to current user's profile name
  IF p_closed_by_name IS NOT NULL THEN
    v_closed_by_name := p_closed_by_name;
  ELSE
    SELECT full_name INTO v_closed_by_name
    FROM public.profiles
    WHERE id = auth.uid();
  END IF;

  UPDATE public.cash_shifts
     SET status = 'closed',
         closed_at = now(),
         closed_by = v_closed_by_name,
         closing_cash = p_cash_amount,
         closing_banks = COALESCE(v_bank_summary, '{}'::jsonb),
         updated_at = now()
   WHERE id = v_shift.id
   RETURNING * INTO v_shift;

  RETURN v_shift;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_or_create_open_shift(p_opened_by_name text DEFAULT NULL::text)
 RETURNS cash_shifts
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  v_shop_id uuid;
  v_today date := (now() AT TIME ZONE 'Asia/Almaty')::date;
  v_shift public.cash_shifts;
  v_next_number integer;
  v_opened_by_name text;
BEGIN
  v_shop_id := public.current_shop_id();
  
  -- Use provided name or fallback to current user's profile name
  IF p_opened_by_name IS NOT NULL THEN
    v_opened_by_name := p_opened_by_name;
  ELSE
    SELECT full_name INTO v_opened_by_name
    FROM public.profiles
    WHERE id = auth.uid();
  END IF;

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
  VALUES (v_shop_id, v_today, v_next_number, now(), v_opened_by_name)
  RETURNING * INTO v_shift;

  RETURN v_shift;
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



