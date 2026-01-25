import { redirect } from 'next/navigation';
import { redirectToDefaultLocale } from '@/lib/auth/guard/auth/actions/redirectToDefaultLocale';
import { redirectIfGuest } from '@/lib/auth/guard/auth/actions/validateUser';
import { getShopId } from '@/lib/entities/shop/actions/getShopId';
import { logout } from '@/lib/auth/actions/logout';

export default async function Init() {
  // Check if user is authenticated
  await redirectIfGuest();

  // Check if user has a shopId
  // If shopId exists, user setup is complete, redirect to home
  // If shopId doesn't exist, logout and redirect to login with error message
  try {
    await getShopId(); 
  } catch (error) {
    // Profile doesn't exist - logout user and redirect to login with error message
    await logout();
    redirect('/auth/login?error=profile_not_found');
  }

  // User has shopId, setup is complete, redirect to home
  await redirectToDefaultLocale();

  return null;
}
