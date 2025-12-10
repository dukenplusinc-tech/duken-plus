'use server';

import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/lib/supabase/types';

type CashShift = Database['public']['Tables']['cash_shifts']['Row'];

export async function openShift(): Promise<CashShift> {
  const supabase = createClient();

  const { data, error } = await supabase.rpc('get_or_create_open_shift');

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

