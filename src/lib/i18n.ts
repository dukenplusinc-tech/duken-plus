import { createSharedPathnamesNavigation } from 'next-intl/navigation';

import { Locale, locales } from '@/config/languages';

export const { Link, usePathname, useRouter } = createSharedPathnamesNavigation(
  { locales }
);

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
