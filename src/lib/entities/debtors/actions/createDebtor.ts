'use server';

import { DebtorPayload } from '@/lib/entities/debtors/schema';
import { getShop } from '@/lib/entities/shop/actions/get';
import { createClient } from '@/lib/supabase/server';

export async function createDebtor(payload: DebtorPayload): Promise<string> {
  const supabase = createClient();

  const shop = await getShop();

  const { error, data } = await supabase
    .from('debtors')
    .insert({
      ...payload,
      shop_id: shop.id,
    })
    .select('id')
    .single();

  if (error) {
    throw error;
  }

  return data?.id;
}
