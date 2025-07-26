import useSWR from 'swr';

import { createClient } from '@/lib/supabase/client';

import { DeliveryItem } from './useTodayDeliveriesList';

export const useConsignmentDeliveriesList = () => {
  const supabase = createClient();

  return useSWR('consignmentDeliveries', async () => {
    const { data, error } = await supabase
      .from('deliveries')
      .select(
        `
        id,
        contractor_id,
        status,
        consignment_status,
        amount_expected,
        amount_received,
        expected_date,
        consignment_due_date,
        is_consignement,
        contractors ( title )
      `
      )
      .eq('is_consignement', true)
      .not('consignment_due_date', 'is', null)
      .order('consignment_due_date', { ascending: true });

    if (error) {
      console.error('Failed to load consignment deliveries:', error);
      return [];
    }

    return data.map((row) => ({
      id: row.id,
      contractor_id: row.contractor_id,
      contractor_name: row.contractors?.title ?? 'Без названия',
      amount_expected: row.amount_expected,
      consignment_status: row.consignment_status,
      amount_received: row.amount_received,
      expected_date: row.expected_date,
      consignment_due_date: row.consignment_due_date,
      status: row.status,
    })) as DeliveryItem[];
  });
};
