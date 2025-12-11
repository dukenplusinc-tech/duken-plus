'use server';

import { ContractorPayload } from '@/lib/entities/contractors/schema';
import { getShop } from '@/lib/entities/shop/actions/get';
import { createClient } from '@/lib/supabase/server';

export async function createContractor(
  payload: ContractorPayload
): Promise<string> {
  const supabase = await createClient();

  const shop = await getShop();

  const { error, data } = await supabase
    .from('contractors')
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
