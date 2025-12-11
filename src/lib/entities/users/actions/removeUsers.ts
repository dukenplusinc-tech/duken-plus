'use server';

import { checkIfAllowed } from '@/lib/auth/guard/auth/actions/checkIfAllowed';
import { RoleScope } from '@/lib/entities/roles/types';
import { createClient } from '@/lib/supabase/server';

export async function removeUsers(uid: string | string[]) {
  if (!(await checkIfAllowed(RoleScope.users))) {
    throw new Error('Not allowed');
  }

  const ids = Array.isArray(uid) ? uid : [uid];

  const supabase = await createClient();

  for (const id of ids) {
    await supabase.from('profiles').delete().eq('id', id);
    const { error: err2 } = await supabase.auth.admin.deleteUser(id);

    console.log({ err2 });
  }

  return true;
}
