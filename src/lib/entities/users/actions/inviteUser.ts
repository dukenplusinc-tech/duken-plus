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

  const profileResponse = await supabase.from('profiles').insert({
    id: data.user.id,
    full_name: values.full_name,
    role_id: Number(values.role_id),
  });

  if (profileResponse.error) {
    throw profileResponse.error;
  }

  return true;
}
