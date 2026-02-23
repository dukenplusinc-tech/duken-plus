import useSWR from 'swr';

import { createClient } from '@/lib/supabase/client';
import type { DeliveryItem } from '@/lib/entities/deliveries/hooks/useTodayDeliveriesList';
import { todayInTZ } from '@/lib/utils/tz';

export const useOverdueDeliveriesList = () => {
  const supabase = createClient();
  const today = todayInTZ();

  return useSWR(['overdueDeliveriesList'], async () => {
    const query = supabase
      .from('deliveries')
      .select(`
        id,
        contractor_id,
        amount_expected,
        amount_received,
        status,
        consignment_status,
        expected_date,
        contractors ( title )
      `)
      .in('status', ['due', 'pending'])
      .lt('expected_date', today)
      .order('expected_date', { ascending: true });

    const { data, error } = await query;

    if (error) {
      console.error('Error loading overdue deliveries:', error);
      return [];
    }

    return data.map((row) => ({
      id: row.id,
      contractor_id: row.contractor_id,
      amount_expected: Number(row.amount_expected),
      amount_received: row.amount_received ? Number(row.amount_received) : null,
      expected_date: row.expected_date,
      status: row.status,
      contractor_name: row.contractors?.title || 'Без названия',
    })) as DeliveryItem[];
  });
};

