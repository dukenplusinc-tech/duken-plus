import useSWR from 'swr';

import { createClient } from '@/lib/supabase/client';

export type DeliveryItem = {
  id: string;
  contractor_id: string;
  amount_expected: number;
  amount_received: number | null;
  status: 'pending' | 'accepted' | 'due';
  expected_date: string;
  contractor_name: string;
};

export const useTodayDeliveriesList = (showOverdueOnly = false) => {
  const supabase = createClient();
  const today = new Date().toISOString().slice(0, 10);

  return useSWR(['todayDeliveriesList', showOverdueOnly], async () => {
    let query = supabase.from('deliveries').select(`
        id,
        contractor_id,
        amount_expected,
        amount_received,
        status,
        expected_date,
        contractors ( title )
      `);

    if (showOverdueOnly) {
      query = query.in('status', ['due', 'pending']).lt('expected_date', today);
    } else {
      query = query.eq('expected_date', today);
    }

    query = query.order('expected_date', { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error('Error loading deliveries:', error);
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
