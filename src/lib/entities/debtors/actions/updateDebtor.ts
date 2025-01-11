'use server';

import { DebtorPayload } from '@/lib/entities/debtors/schema';
import { createClient } from '@/lib/supabase/server';

export async function updateDebtor(
  id: string,
  payload: Partial<DebtorPayload>
): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase.from('debtors').update(payload).eq('id', id);

  if (error) {
    throw error;
  }
}
