'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { redirectIfGuest } from '@/lib/auth/guard/auth/actions/redirectIfGuest';
import { SecurityPayload } from '@/lib/entities/users/schema';
import { createClient } from '@/lib/supabase/server';

export async function updateSecuritySettings(payload: SecurityPayload) {
  await redirectIfGuest();

  const supabase = createClient();

  await supabase.auth.updateUser({
    password: payload.password,
  });

  revalidatePath('/', 'layout');
  redirect('/');
}
