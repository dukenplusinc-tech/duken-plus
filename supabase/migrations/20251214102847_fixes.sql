drop function if exists "public"."get_or_create_open_shift"();

drop view if exists "public"."cash_shift_dashboard";

set check_function_bodies = off;

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
   FROM ((public.cash_shifts s
     LEFT JOIN ( SELECT cash_register.shift_id,
            sum(cash_register.amount) AS cash_total
           FROM public.cash_register
          WHERE (cash_register.type = 'cash'::public.transaction_type)
          GROUP BY cash_register.shift_id) cash ON ((cash.shift_id = s.id)))
     LEFT JOIN ( SELECT cash_register.shift_id,
            sum(cash_register.amount) AS bank_total
           FROM public.cash_register
          WHERE (cash_register.type = 'bank_transfer'::public.transaction_type)
          GROUP BY cash_register.shift_id) bank ON ((bank.shift_id = s.id)));


CREATE OR REPLACE FUNCTION public.get_or_create_open_shift(p_opened_by_name text DEFAULT NULL::text)
 RETURNS public.cash_shifts
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  v_shop_id uuid;
  v_today date := (now() AT TIME ZONE 'Asia/Almaty')::date;
  v_shift public.cash_shifts;
  v_next_number integer;
  v_opened_by_name text;
  v_lock_key bigint;
  v_retry_count integer := 0;
  v_max_retries integer := 5;
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

  -- Check if there's already an open shift
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

  -- Use advisory lock based on shop_id to prevent concurrent insertions
  -- Convert UUID to bigint for advisory lock (using hash)
  v_lock_key := ('x' || substr(md5(v_shop_id::text), 1, 15))::bit(64)::bigint;
  
  -- Try to acquire lock, wait up to 5 seconds
  PERFORM pg_advisory_xact_lock(v_lock_key);

  -- Re-check for open shift after acquiring lock (another process might have created it)
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

  -- Calculate next shift_number from ALL shifts for this shop (not just today)
  -- The unique constraint is on (shop_id, shift_number) globally
  SELECT COALESCE(MAX(shift_number), 0) + 1
    INTO v_next_number
    FROM public.cash_shifts
   WHERE shop_id = v_shop_id;

  -- Retry loop in case of constraint violation (shouldn't happen with lock, but just in case)
  LOOP
    BEGIN
      INSERT INTO public.cash_shifts (shop_id, shift_date, shift_number, opened_at, opened_by)
      VALUES (v_shop_id, v_today, v_next_number, now(), v_opened_by_name)
      RETURNING * INTO v_shift;
      
      -- Success, exit loop
      EXIT;
    EXCEPTION
      WHEN unique_violation THEN
        v_retry_count := v_retry_count + 1;
        IF v_retry_count > v_max_retries THEN
          RAISE EXCEPTION 'Failed to create shift after % retries', v_max_retries;
        END IF;
        
        -- Recalculate next number (another process might have inserted)
        SELECT COALESCE(MAX(shift_number), 0) + 1
          INTO v_next_number
          FROM public.cash_shifts
         WHERE shop_id = v_shop_id;
    END;
  END LOOP;

  RETURN v_shift;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_user_auth_data(user_id uuid)
 RETURNS TABLE(email text, phone text)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    u.email::text,
    u.phone::text
  FROM auth.users u
  WHERE u.id = user_id;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_debtor_balance_after_delete()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
begin
  update public.debtors d
     set balance = (
           select coalesce(sum(
                    case
                      when dt.transaction_type = 'purchase' then dt.amount
                      when dt.transaction_type = 'loan'     then -dt.amount
                    end
                  ), 0)
           from public.debtor_transactions dt
           where dt.debtor_id = old.debtor_id
         ),
         updated_at = now()
   where d.id = old.debtor_id;

  perform public.recalculate_is_overdue(old.debtor_id);
  return old;
end;
$function$
;


