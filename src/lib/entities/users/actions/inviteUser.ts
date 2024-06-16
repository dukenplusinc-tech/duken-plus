'use server';

import { InviteUser } from '@/lib/entities/users/schema';
import { createClient } from '@/lib/supabase/server';

export async function inviteUser(values: InviteUser, redirectTo: string) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.admin.inviteUserByEmail(
    values.email,
    {
      redirectTo,
    }
  );

  if (error) {
    throw error;
  }

  return true;
}
