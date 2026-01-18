'use server';

import { createClient } from '@/lib/supabase/server';
import * as fromUrl from '@/lib/url/generator';

export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  shopName: string;
  city: string;
  address: string;
  locale?: string;
}

export async function register(data: RegisterData) {
  const supabase = await createClient();

  // Prepare user metadata
  // Include locale for email template localization (default to 'ru')
  const userMetadata = {
    full_name: data.fullName,
    phone: data.phone || null,
    shop_name: data.shopName,
    city: data.city,
    address: data.address,
    language: data.locale || 'ru', // Default to Russian if not provided
  };

  // Create user account with email confirmation required
  // Redirect to confirm route which will handle verification and then redirect to init
  const confirmUrl = new URL('/auth/confirm', fromUrl.fullUrl(''));
  confirmUrl.searchParams.set('next', fromUrl.toInit());
  
  const { data: authData, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      emailRedirectTo: confirmUrl.toString(),
      data: userMetadata,
    },
  });

  if (error) {
    // Check for specific error types
    if (error.message.includes('already registered') || error.message.includes('already exists')) {
      return { error: 'email_exists' };
    }
    return { error: error.message };
  }

  if (!authData.user) {
    return { error: 'registration_failed' };
  }

  return { success: true, email: data.email };
}

export async function resendVerification(email: string) {
  const supabase = await createClient();

  // Redirect to confirm route which will handle verification
  const confirmUrl = new URL('/auth/confirm', fromUrl.fullUrl(''));
  confirmUrl.searchParams.set('next', fromUrl.toInit());
  
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email: email,
    options: {
      emailRedirectTo: confirmUrl.toString(),
    },
  });

  if (error) {
    // Check for rate limiting
    if (
      error.message.includes('rate limit') ||
      error.message.includes('too many requests')
    ) {
      return { error: 'email_rate_limit' };
    }
    return { error: error.message };
  }

  return { success: true };
}
