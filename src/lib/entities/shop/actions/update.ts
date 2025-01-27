'use server';

import { getShopId } from '@/lib/entities/shop/actions/getShopId';
import { ShopPayload } from '@/lib/entities/shop/schema';
import { createClient } from '@/lib/supabase/server';

export async function updateShop(payload: ShopPayload): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase
    .from('shops')
    .update(payload)
    .eq('id', await getShopId());

  if (error) {
    throw error;
  }
}
