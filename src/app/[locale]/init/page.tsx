import { redirect } from 'next/navigation';
import { redirectToDefaultLocale } from '@/lib/auth/guard/auth/actions/redirectToDefaultLocale';
import { redirectIfGuest } from '@/lib/auth/guard/auth/actions/validateUser';
import { getShopId } from '@/lib/entities/shop/actions/getShopId';

export default async function Init() {
  // Check if user is authenticated
  await redirectIfGuest();

  // Check if user has a shopId
  // If shopId exists, user setup is complete, redirect to home
  // If shopId doesn't exist, redirect to login (shouldn't happen if trigger works)
  try {
    await getShopId(); 
  } catch {
    // ShopId doesn't exist - this shouldn't happen if trigger works
    // Redirect to login as fallback
    redirect('/auth/login');
  }

  // User has shopId, setup is complete, redirect to home
  await redirectToDefaultLocale();

  return null;
}
