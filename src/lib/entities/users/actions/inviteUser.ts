'use server';

import { InviteUser } from '@/lib/entities/users/schema';
import { createClient } from '@/lib/supabase/server';

export async function inviteUser(values: InviteUser) {
  console.log('Test from server', { values });

  const supabase = createClient();

  const { data, error } = await supabase.auth.admin.inviteUserByEmail(
    values.email
  );

  console.log({
    data,
    error,
  });

  return true;
}
