'use server';

import { shop } from '@/config/shop';
import type { Shop } from '@/lib/entities/shop/schema';
import { createClient } from '@/lib/supabase/server';

export async function getShop(): Promise<Shop> {
  const supabase = createClient();

  const { error, data } = await supabase
    .from('shops')
    .select('id, title')
    .eq('id', shop.hardcodedId)
    .single();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error('Unable to find shop');
  }

  return data;
}
