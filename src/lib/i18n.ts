import { Locale } from '@/config/languages';
import { Link, usePathname, useRouter } from '@/i18n/routing';

export { Link, usePathname, useRouter };

export const useChangeLocale = () => {
  const pathname = usePathname();
  const router = useRouter();

  return (locale: Locale) => {
    // ...if the user chose Arabic ("ar-eg"),
    // router.replace() will prefix the pathname
    // with this `newLocale`, effectively changing
    // languages by navigating to `/ar-eg/about`.
    router.replace(pathname, { locale });
  };
};
