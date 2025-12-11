'use server';

import { createClient } from '@/lib/supabase/server';

export async function removeEmployees(uid: string | string[]) {
  const ids = Array.isArray(uid) ? uid : [uid];

  const supabase = await createClient();

  await supabase.from('employees').delete().in('id', ids);

  return true;
}
