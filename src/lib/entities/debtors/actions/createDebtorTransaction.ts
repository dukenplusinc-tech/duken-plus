'use server';

import { DebtorTransactionPayload } from '@/lib/entities/debtors/schema';
import { createClient } from '@/lib/supabase/server';

export async function createDebtorTransaction(
  payload: DebtorTransactionPayload
): Promise<string> {
  const supabase = createClient();

  const { error, data } = await supabase
    .from('debtor_transactions')
    .insert({
      ...payload,
    })
    .select('id')
    .single();

  if (error) {
    throw error;
  }

  return data?.id;
}
