'use server';

import { Expense } from '@/lib/entities/expenses/schema';
import { getShopId } from '@/lib/entities/shop/actions/getShopId';
import { createClient } from '@/lib/supabase/server';

export async function createExpense(
  values: Omit<Expense, 'id' | 'created_at' | 'shop_id'>
) {
  const supabase = createClient();

  const payload = {
    ...values,
    shop_id: await getShopId(),
  };

  console.log('payload', payload);

  const { error } = await supabase.from('expenses').insert(payload);

  if (error) {
    throw new Error(error.message);
  }
}
