-- Change default language from 'en' to 'ru' in profiles table
ALTER TABLE public.profiles 
  ALTER COLUMN language SET DEFAULT 'ru';

-- Update existing profiles with 'en' language to 'ru' (optional, but recommended)
UPDATE public.profiles 
  SET language = 'ru' 
  WHERE language = 'en' OR language IS NULL;
