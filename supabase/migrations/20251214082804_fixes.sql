drop view if exists "public"."cash_shift_dashboard";

drop view if exists "public"."extended_profiles";

set check_function_bodies = off;

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


create or replace view "public"."extended_profiles" as  SELECT p.id,
    p.full_name,
    p.avatar_url,
    p.role_id,
    p.created_at,
    p.updated_at,
    p.language,
    p.shop_id,
    ua.email,
    ua.phone
   FROM (public.profiles p
     LEFT JOIN LATERAL public.get_user_auth_data(p.id) ua(email, phone) ON (true));



