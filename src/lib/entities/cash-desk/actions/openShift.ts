'use server';

import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/lib/supabase/types';

type CashShift = Database['public']['Tables']['cash_shifts']['Row'];

export async function openShift(openedByName: string | null): Promise<CashShift> {
  const supabase = await createClient();

  const { data, error } = await (supabase.rpc as any)('get_or_create_open_shift', {
    p_opened_by_name: openedByName,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

