'use server';

import { getShopId } from '@/lib/entities/shop/actions/getShopId';
import { DeliveryFormValues } from '@/lib/entities/suppliers/schema';
import { createClient } from '@/lib/supabase/server';
import { Database } from '@/lib/supabase/types';

export async function createDelivery(
  values: Pick<
    DeliveryFormValues,
    'contractor_id' | 'expected_date' | 'amount_expected'
  >
) {
  const supabase = createClient();

  if (!values.contractor_id) {
    throw new Error('Missing supplier contractor_id');
  }

  const payload: Database['public']['Tables']['deliveries']['Insert'] = {
    ...values,
    expected_date: values.expected_date!,
    contractor_id: String(values.contractor_id),
    amount_expected: Number(values.amount_expected),
    status: 'pending',
    shop_id: await getShopId(),
  };

  const { error } = await supabase.from('deliveries').insert(payload);

  if (error) {
    throw new Error(error.message);
  }
}
