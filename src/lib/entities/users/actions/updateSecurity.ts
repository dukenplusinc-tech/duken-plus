'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { validateUser } from '@/lib/auth/guard/auth/actions/validateUser';
import { SecurityPayload } from '@/lib/entities/users/schema';
import { createClient } from '@/lib/supabase/server';

export async function updateSecuritySettings(payload: SecurityPayload) {
  await validateUser();

  const supabase = createClient();

  if (payload.pin_code) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      await supabase
        .from('profiles')
        .update({
          pin_code: payload.pin_code,
        })
        .eq('id', user.id);
    }
  }

  if (payload.password) {
    await supabase.auth.updateUser({
      password: payload.password,
    });
  }

  revalidatePath('/', 'layout');
  redirect('/');
}
