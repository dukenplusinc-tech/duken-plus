import { redirectIfGuest } from '@/lib/auth/guard/auth/actions/redirectIfGuest';
import { redirectToDefaultLocale } from '@/lib/auth/guard/auth/actions/redirectToDefaultLocale';

export default async function Init() {
  await redirectIfGuest();
  await redirectToDefaultLocale();

  return null;
}
