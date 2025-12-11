'use server';

import { createClient } from '@/lib/supabase/server';

export async function markConsignmentPaid(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('deliveries')
    .update({
      consignment_status: 'closed',
    })
    .eq('id', id);

  if (error) {
    throw new Error('Failed to close consignment: ' + error.message);
  }
}
