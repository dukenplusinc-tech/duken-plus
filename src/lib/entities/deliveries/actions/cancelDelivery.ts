'use server';

import { createClient } from '@/lib/supabase/server';

export async function cancelDelivery(deliveryId: string) {
  const supabase = await createClient();

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
