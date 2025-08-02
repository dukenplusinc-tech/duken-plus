'use server';

import { createClient } from '@/lib/supabase/server';

export async function cancelDelivery(deliveryId: string) {
  const supabase = createClient();

  const { error } = await supabase
    .from('deliveries')
    .update({
      status: 'canceled',
    })
    .eq('id', deliveryId);

  if (error) {
    throw new Error(error.message);
  }
}
