import { Locale } from '@/config/languages';
import { Link, usePathname, useRouter } from '@/i18n/routing';
import { useSearchParams } from 'next/navigation';

export { Link, usePathname, useRouter };

export const useChangeLocale = () => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  return (locale: Locale) => {
    // Preserve all URL search parameters when changing locale
    const currentSearch = searchParams.toString();
    const newPath = currentSearch ? `${pathname}?${currentSearch}` : pathname;
    
    // ...if the user chose Arabic ("ar-eg"),
    // router.replace() will prefix the pathname
    // with this `newLocale`, effectively changing
    // languages by navigating to `/ar-eg/about`.
    router.replace(newPath, { locale });
  };
};
