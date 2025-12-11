'use server';

import { createClient } from '@/lib/supabase/server';

export async function removeDebtorTransactions(uid: string | string[]) {
  const ids = Array.isArray(uid) ? uid : [uid];

  const supabase = await createClient();

  await supabase.from('debtor_transactions').delete().in('id', ids);

  return true;
}
