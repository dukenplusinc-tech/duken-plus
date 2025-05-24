import { redirectToDefaultLocale } from '@/lib/auth/guard/auth/actions/redirectToDefaultLocale';
import { validateUser } from '@/lib/auth/guard/auth/actions/validateUser';

export default async function Init() {
  await validateUser();
  await redirectToDefaultLocale();

  return null;
}
