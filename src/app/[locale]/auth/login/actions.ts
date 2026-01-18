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
  redirectTo,
  locale,
}: {
  email: string;
  redirectTo: string;
  locale?: string;
}) {
  const supabase = await createClient();

  // Use provided locale or default to Russian
  const userLanguage = locale || 'ru';

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
    data: {
      language: userLanguage,
    },
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
