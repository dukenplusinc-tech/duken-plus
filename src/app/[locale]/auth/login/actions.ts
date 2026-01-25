'use server';

import { createClient } from '@/lib/supabase/server';

export async function login(data: { email: string; password: string }) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function recoverPassword({
  email,
  locale,
}: {
  email: string;
  locale?: string;
}) {
  const supabase = await createClient();

  // Use provided locale or default to Russian
  const userLanguage = locale || 'ru';

  // Send OTP for password recovery
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      data: {
        language: userLanguage,
      },
      shouldCreateUser: false,
    },
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function verifyOtpAndResetPassword({
  email,
  token,
  password,
}: {
  email: string;
  token: string;
  password: string;
}) {
  const supabase = await createClient();

  // Verify OTP
  const { error: verifyError, data } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'recovery',
  });

  if (verifyError || !data.user) {
    return { error: verifyError?.message || 'Invalid OTP code' };
  }

  // Update password
  const { error: updateError } = await supabase.auth.updateUser({
    password,
  });

  if (updateError) {
    return { error: updateError.message };
  }

  return { success: true };
}
