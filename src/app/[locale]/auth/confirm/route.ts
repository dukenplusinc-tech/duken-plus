import { NextResponse, type NextRequest } from 'next/server';
import { type EmailOtpType } from '@supabase/supabase-js';

import { createClient } from '@/lib/supabase/server';
import * as fromUrl from '@/lib/url/generator';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  // Handle both 'token' and 'token_hash' parameters (Supabase may send either)
  const token_hash = searchParams.get('token_hash') || searchParams.get('token');
  const type = searchParams.get('type') as EmailOtpType | null;
  const next = searchParams.get('next');

  const redirectTo = request.nextUrl.clone();

  if (token_hash && type) {
    const supabase = await createClient();

    const { error, data } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (!error && data.user) {
      // Check if this is a new registration (email confirmation)
      // by checking if user has shop metadata (indicates they just registered)
      const userMetadata = data.user.user_metadata;
      const isNewRegistration = userMetadata?.shop_name;

      // If it's a new registration, redirect to init for setup completion
      // Otherwise, use the provided next parameter or default to home
      if (isNewRegistration) {
        redirectTo.pathname = fromUrl.toInit();
      } else if (next) {
        redirectTo.pathname = next;
      } else {
        redirectTo.pathname = fromUrl.toHome();
      }

      redirectTo.searchParams.delete('token_hash');
      redirectTo.searchParams.delete('token');
      redirectTo.searchParams.delete('type');
      redirectTo.searchParams.delete('next');

      return NextResponse.redirect(redirectTo);
    }
  }

  // return the user to an error page with some instructions
  redirectTo.pathname = '/error';
  redirectTo.searchParams.delete('token_hash');
  redirectTo.searchParams.delete('token');
  redirectTo.searchParams.delete('type');
  redirectTo.searchParams.delete('next');
  return NextResponse.redirect(redirectTo);
}
