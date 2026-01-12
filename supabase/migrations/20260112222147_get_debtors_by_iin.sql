CREATE OR REPLACE FUNCTION public.get_debtors_by_iin(p_iin text)
 RETURNS TABLE(
   id uuid,
   full_name text,
   iin text,
   phone text,
   address text,
   max_credit_amount numeric,
   balance numeric,
   work_place text,
   additional_info text,
   created_at timestamp without time zone,
   updated_at timestamp without time zone,
   shop_id uuid,
   blacklist boolean,
   shop_title text
 )
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_user_city text;
BEGIN
  -- Get the current user's shop city
  SELECT s.city INTO v_user_city
  FROM shops s
  JOIN profiles p ON p.shop_id = s.id
  WHERE p.id = auth.uid()
  LIMIT 1;

  RETURN QUERY
  SELECT 
    d.id,
    d.full_name,
    d.iin,
    d.phone,
    d.address,
    d.max_credit_amount,
    d.balance,
    d.work_place,
    d.additional_info,
    d.created_at,
    d.updated_at,
    d.shop_id,
    d.blacklist,
    s.title as shop_title
  FROM debtors d
  JOIN shops s ON d.shop_id = s.id
  WHERE d.iin = p_iin
    AND s.city = v_user_city  -- Filter by city to show all debtors in the same city
  ORDER BY s.title, d.full_name;
END;
$function$
;
