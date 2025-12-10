'use server';

import type { CashRegisterPayload } from '@/lib/entities/cash-desk/schema';
import { getShopId } from '@/lib/entities/shop/actions/getShopId';
import { createClient } from '@/lib/supabase/server';

export async function createCashRegisterEntry(
  payload: CashRegisterPayload
): Promise<string> {
  const supabase = createClient();
  const shopId = await getShopId();

  // Query for an open shift
  const { data: shift, error: shiftError } = await supabase
    .from('cash_shifts')
    .select('id')
    .eq('shop_id', shopId)
    .eq('status', 'open')
    .order('opened_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (shiftError) {
    throw shiftError;
  }

  if (!shift) {
    throw new Error('No open shift found. Please open a shift before creating entries.');
  }

  const { error, data } = await supabase
    .from('cash_register')
    .insert({
      shop_id: shopId,
      from: payload.from,
      type: payload.type,
      amount: payload.amount,
      added_by: payload.added_by,
      bank_name: payload.bank_name,
      shift_id: shift.id,
    })
    .select('id')
    .single();

  if (error) {
    throw error;
  }

  return data?.id;
}
