'use server';

import { createClient } from '@/lib/supabase/server';

export async function removeDebtors(uid: string | string[]) {
  const ids = Array.isArray(uid) ? uid : [uid];

  const supabase = await createClient();

  await supabase.from('debtors').delete().in('id', ids);

  return true;
}
