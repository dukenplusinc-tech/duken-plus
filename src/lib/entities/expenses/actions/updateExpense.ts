'use server';

import { type Expense } from '@/lib/entities/expenses/schema';
import { getShopId } from '@/lib/entities/shop/actions/getShopId';
import { createClient } from '@/lib/supabase/server';

export async function updateExpense(
  id: string,
  values: Partial<Omit<Expense, 'id' | 'shop_id' | 'created_at' | 'date'>>
) {
  const supabase = createClient();

  const { error } = await supabase
    .from('expenses')
    .update({
      ...values,
      shop_id: await getShopId(),
    })
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }
}
