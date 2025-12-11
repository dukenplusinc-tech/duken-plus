'use server';

import { ContractorPayload } from '@/lib/entities/contractors/schema';
import { createClient } from '@/lib/supabase/server';

export async function updateContractor(
  id: string,
  payload: ContractorPayload
): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('contractors')
    .update(payload)
    .eq('id', id);

  if (error) {
    throw error;
  }
}
