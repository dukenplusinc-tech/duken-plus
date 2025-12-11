'use server';

import { createClient } from '@/lib/supabase/server';

export async function removeContractors(uid: string | string[]) {
  const ids = Array.isArray(uid) ? uid : [uid];

  const supabase = await createClient();

  await supabase.from('contractors').delete().in('id', ids);

  return true;
}
