import { format } from 'date-fns';
import useSWR from 'swr';

import { createClient } from '@/lib/supabase/client';

export type DeliveryItem = {
  id: string;
  contractor_id: string;
  amount_expected: number;
  amount_received: number | null;
  status: 'pending' | 'accepted' | 'due';
  contractor_name: string;
};

export const useTodayDeliveriesList = () => {
  const today = format(new Date(), 'yyyy-MM-dd');
  const supabase = createClient();

  return useSWR('todayDeliveriesList', async () => {
    const { data, error } = await supabase
      .from('deliveries')
      .select(
        `
        id,
        contractor_id,
        amount_expected,
        amount_received,
        status,
        contractors ( title )
      `
      )
      .eq('expected_date', today)
      .order('contractor_id');

    if (error) {
      console.error('Error loading deliveries:', error);
      return [];
    }

    return data.map((row) => ({
      id: row.id,
      contractor_id: row.contractor_id,
      amount_expected: Number(row.amount_expected),
      amount_received: row.amount_received ? Number(row.amount_received) : null,
      status: row.status,
      contractor_name: row.contractors?.title || 'Без названия',
    })) as DeliveryItem[];
  });
};
