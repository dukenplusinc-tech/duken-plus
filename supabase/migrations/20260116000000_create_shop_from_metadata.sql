-- Function to create shop from user metadata
-- This is a recovery function for cases where the database trigger didn't run
-- Uses SECURITY DEFINER to bypass RLS policies
CREATE OR REPLACE FUNCTION public.create_shop_from_user_metadata()
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  v_user_id uuid;
  v_shop_id uuid;
  v_shop_name text;
  v_city text;
  v_address text;
  v_role_id bigint;
BEGIN
  -- Get current user ID
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'User not authenticated';
  END IF;

  -- Check if profile exists, if not create it
  -- This handles cases where the trigger didn't run
  INSERT INTO public.profiles (id, full_name, avatar_url, phone)
  SELECT 
    id,
    raw_user_meta_data->>'full_name',
    raw_user_meta_data->>'avatar_url',
    raw_user_meta_data->>'phone'
  FROM auth.users
  WHERE id = v_user_id
  ON CONFLICT (id) DO NOTHING;

  -- Check if user already has a shopId
  SELECT shop_id INTO v_shop_id
  FROM public.profiles
  WHERE id = v_user_id;
  
  IF v_shop_id IS NOT NULL THEN
    RETURN v_shop_id;
  END IF;

  -- Get shop metadata from user
  SELECT 
    raw_user_meta_data->>'shop_name',
    COALESCE(raw_user_meta_data->>'city', ''),
    COALESCE(raw_user_meta_data->>'address', '')
  INTO v_shop_name, v_city, v_address
  FROM auth.users
  WHERE id = v_user_id;

  IF v_shop_name IS NULL OR v_shop_name = '' THEN
    RAISE EXCEPTION 'Shop metadata not found in user profile';
  END IF;

  -- Create shop
  INSERT INTO public.shops (title, city, address)
  VALUES (v_shop_name, v_city, v_address)
  RETURNING id INTO v_shop_id;

  -- Link profile to shop
  UPDATE public.profiles
  SET shop_id = v_shop_id
  WHERE id = v_user_id;

  -- Check if admin role exists, if not create it
  SELECT id INTO v_role_id
  FROM public.roles
  WHERE role = 'admin'
  LIMIT 1;

  IF v_role_id IS NULL THEN
    INSERT INTO public.roles (role, scope)
    VALUES ('admin', ARRAY['users', 'employees', 'contractors', 'debtors', 'cash_desk', 'notes', 'chat', 'statistics', 'subscription'])
    RETURNING id INTO v_role_id;
  END IF;

  -- Assign admin role to the user
  UPDATE public.profiles
  SET role_id = v_role_id
  WHERE id = v_user_id;

  RETURN v_shop_id;
END;
$function$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.create_shop_from_user_metadata() TO authenticated;
