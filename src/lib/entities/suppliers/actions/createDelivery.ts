'use server';

import { getShopId } from '@/lib/entities/shop/actions/getShopId';
import { DeliveryFormValues } from '@/lib/entities/suppliers/schema';
import { createClient } from '@/lib/supabase/server';

export async function createDelivery(values: DeliveryFormValues) {
  const supabase = createClient();

  const { error } = await supabase.from('deliveries').insert({
    ...values,
    status: 'pending',
    shop_id: await getShopId(),
  });

  if (error) {
    throw new Error(error.message);
  }
}
