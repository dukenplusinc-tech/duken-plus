import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { defaultLocale, locales } from './config/languages';

const handleI18nRouting = createMiddleware(routing);

export async function proxy(request: NextRequest) {
  // Create Supabase client first to check authentication
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Extract the pathname from the URL
  const pathname = request.nextUrl.pathname;

  // Check if the pathname already has a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // If no locale in pathname, check user's preference
  if (!pathnameHasLocale) {
    let userLocale: string | null = null;

    // If user is authenticated, get their locale preference
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('language')
        .eq('id', user.id)
        .single();

      if (profile?.language && locales.includes(profile.language as any)) {
        userLocale = profile.language;
      }
    }

    // Use user's locale if available, otherwise use default locale
    const localeToUse = userLocale || defaultLocale;

    // Redirect to the appropriate locale, preserving query parameters
    const newUrl = new URL(`/${localeToUse}${pathname === '/' ? '' : pathname}`, request.url);
    newUrl.search = request.nextUrl.search; // Preserve query parameters
    return NextResponse.redirect(newUrl);
  }

  // If pathname already has a locale, let next-intl handle it
  const response = handleI18nRouting(request);

  // Update cookies in the response
  const responseSupabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options });
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  await responseSupabase.auth.getUser();

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
