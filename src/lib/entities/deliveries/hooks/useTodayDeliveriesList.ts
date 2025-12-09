import useSWR from 'swr';

import { createClient } from '@/lib/supabase/client';

export type DeliveryItem = {
  id: string;
  contractor_id: string;
  amount_expected: number;
  amount_received: number | null;
  status: 'pending' | 'accepted' | 'due' | 'canceled';
  expected_date: string;
  contractor_name: string;
  consignment_status: 'open' | 'closed' | null;
  consignment_due_date: string | null;
};

function toLocalISODate(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const useTodayDeliveriesList = () => {
  const supabase = createClient();
  const today = toLocalISODate(new Date());

  return useSWR(['todayDeliveriesList'], async () => {
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
      .eq('expected_date', today)
      .order('expected_date', { ascending: false });

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
