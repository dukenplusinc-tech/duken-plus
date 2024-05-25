'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { redirectIfGuest } from '@/lib/auth/guard/auth/actions/redirectIfGuest';
import { createClient } from '@/lib/supabase/server';

export async function changePassword(formData: FormData) {
  await redirectIfGuest();

  const supabase = createClient();

  const data = {
    password: formData.get('password') as string,
  };

  await supabase.auth.updateUser(data);

  revalidatePath('/', 'layout');
  redirect('/');
}
