import { useQuery } from '@supabase-cache-helpers/postgrest-swr';

import { createClient } from '@/lib/supabase/client';
import { Database } from '@/lib/supabase/types';

const supabase = createClient();

export function useCalendarDeliveries(date: Date) {
  const month = date.getMonth(); // 0-indexed
  const year = date.getFullYear();

  const startDate = new Date(year, month, 1).toISOString().slice(0, 10);
  const endDate = new Date(year, month + 1, 0).toISOString().slice(0, 10);

  return useQuery<Database['public']['Tables']['deliveries']['Row']>(
    supabase
      .from('deliveries')
      .select('*')
      .or('status.eq.pending,status.eq.due,is_consignement.eq.true')
      .gte('expected_date', startDate)
      .lte('expected_date', endDate),
    {
      revalidateOnFocus: false,
    }
  );
}
