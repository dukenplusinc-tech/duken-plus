'use server';

import { AcceptDeliveryFormValues } from '@/lib/entities/deliveries/schema';
import { createClient } from '@/lib/supabase/server';
import { Database } from '@/lib/supabase/types';

export async function acceptDelivery(
  deliveryId: string,
  values: Pick<
    AcceptDeliveryFormValues,
    'amount_received' | 'is_consignement' | 'consignment_due_date'
  >
) {
  const supabase = createClient();

  const payload: Database['public']['Tables']['deliveries']['Update'] = {
    status: 'accepted',
    accepted_date: 'now()',
    amount_received: Number(values.amount_received),
    is_consignement: values.is_consignement ?? false,
    consignment_status: values.is_consignement ? 'open' : null,
    consignment_due_date: values.is_consignement
      ? values.consignment_due_date || null
      : null,
  };

  const { error } = await supabase
    .from('deliveries')
    .update(payload)
    .eq('id', deliveryId);

  if (error) {
    throw new Error(error.message);
  }
}
