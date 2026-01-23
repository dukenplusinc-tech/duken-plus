-- Create trigger to automatically create profile when a new user is created
-- This trigger calls handle_new_user() function which creates the profile and shop

-- Drop trigger if it exists (to allow re-running this migration)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
