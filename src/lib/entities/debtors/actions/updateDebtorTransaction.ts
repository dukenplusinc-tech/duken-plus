'use server';

import { DebtorTransactionPayload } from '@/lib/entities/debtors/schema';
import { createClient } from '@/lib/supabase/server';

export async function updateDebtorTransaction(
  id: string,
  payload: Partial<DebtorTransactionPayload>
): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase
    .from('debtor_transactions')
    .update(payload)
    .eq('id', id);

  if (error) {
    throw error;
  }
}
