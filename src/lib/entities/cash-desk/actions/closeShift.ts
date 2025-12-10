'use server';

import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/lib/supabase/types';

type CashShift = Database['public']['Tables']['cash_shifts']['Row'];

export async function closeShift(
  shiftId: string,
  cashAmount: number,
  closedByName: string | null
): Promise<CashShift> {
  const supabase = createClient();

  const { data, error } = await supabase.rpc('close_cash_shift', {
    p_shift_id: shiftId,
    p_cash_amount: cashAmount,
    p_closed_by_name: closedByName,
    p_comment: {},
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error('Failed to close shift: no data returned');
  }

  return data as CashShift;
}

