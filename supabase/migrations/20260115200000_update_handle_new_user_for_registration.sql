-- Update handle_new_user function to create shop and link profile when user registers with shop metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  v_shop_id uuid;
  v_full_name text;
  v_phone text;
  v_shop_name text;
  v_city text;
  v_address text;
  v_language text;
BEGIN
  -- Extract metadata
  v_full_name := new.raw_user_meta_data->>'full_name';
  v_phone := new.raw_user_meta_data->>'phone';
  v_shop_name := new.raw_user_meta_data->>'shop_name';
  v_city := new.raw_user_meta_data->>'city';
  v_address := new.raw_user_meta_data->>'address';
  v_language := COALESCE(new.raw_user_meta_data->>'language', 'ru');

  -- Create profile
  insert into public.profiles (id, full_name, avatar_url, phone, language)
  values (new.id, v_full_name, new.raw_user_meta_data->>'avatar_url', v_phone, v_language);

  -- If shop metadata exists, create shop and link profile
  IF v_shop_name IS NOT NULL AND v_shop_name != '' THEN
    -- Create shop
    INSERT INTO public.shops (title, city, address)
    VALUES (v_shop_name, COALESCE(v_city, ''), COALESCE(v_address, ''))
    RETURNING id INTO v_shop_id;

    -- Link profile to shop
    UPDATE public.profiles
    SET shop_id = v_shop_id
    WHERE id = new.id;

    -- Set default admin role (role_id = 1 is typically admin)
    -- Check if admin role exists, if not, create it
    IF NOT EXISTS (SELECT 1 FROM public.roles WHERE role = 'admin') THEN
      INSERT INTO public.roles (role, scope)
      VALUES ('admin', ARRAY['users', 'employees', 'contractors', 'debtors', 'cash_desk', 'notes', 'chat', 'statistics', 'subscription'])
      ON CONFLICT (role) DO NOTHING;
    END IF;

    -- Assign admin role to the new user
    UPDATE public.profiles
    SET role_id = (SELECT id FROM public.roles WHERE role = 'admin' LIMIT 1)
    WHERE id = new.id;
  END IF;

  return new;
END;
$function$
;
