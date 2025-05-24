'use server';

import type { CashRegisterPayload } from '@/lib/entities/cash-desk/schema';
import { getShopId } from '@/lib/entities/shop/actions/getShopId';
import { createClient } from '@/lib/supabase/server';

export async function createCashRegisterEntry(
  payload: CashRegisterPayload
): Promise<string> {
  const supabase = createClient();

  const { error, data } = await supabase
    .from('cash_register')
    .insert({
      shop_id: await getShopId(),
      from: payload.from,
      type: payload.type,
      amount: payload.amount,
      added_by: payload.added_by,
      bank_name: payload.bank_name,
    })
    .select('id')
    .single();

  if (error) {
    throw error;
  }

  return data?.id;
}
