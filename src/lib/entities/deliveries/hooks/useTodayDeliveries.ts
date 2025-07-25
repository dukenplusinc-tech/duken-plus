import { useState } from 'react';
import { format } from 'date-fns';
import useSWR, { mutate } from 'swr';

import { createClient } from '@/lib/supabase/client';

const fetchDeliveryStats = async () => {
  const supabase = createClient();
  const today = format(new Date(), 'yyyy-MM-dd');

  // Fetch all PENDING deliveries
  const { data, error } = await supabase
    .from('deliveries')
    .select('expected_date, amount_expected')
    .eq('status', 'pending')
    .gte('expected_date', today); // filter today and future

  if (error) {
    console.error('Error fetching deliveries:', error);
    return {
      count: 0,
      totalExpected: 0,
      remainingCompanies: 0,
      remainingAmount: 0,
    };
  }

  const todayDeliveries = data.filter((d) => d.expected_date === today);
  const futureDeliveries = data.filter((d) => d.expected_date > today);

  const count = todayDeliveries.length;
  const totalExpected = todayDeliveries.reduce(
    (acc, d) => acc + Number(d.amount_expected ?? 0),
    0
  );

  const remainingCompanies = futureDeliveries.length;
  const remainingAmount = futureDeliveries.reduce(
    (acc, d) => acc + Number(d.amount_expected ?? 0),
    0
  );

  return {
    count,
    totalExpected,
    remainingCompanies,
    remainingAmount,
  };
};

export const useTodayDeliveries = () => {
  const { data, error } = useSWR('deliveryStats', fetchDeliveryStats, {
    revalidateOnFocus: false,
    dedupingInterval: 60 * 1000,
  });

  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    setLoading(true);
    await mutate('deliveryStats');
    setLoading(false);
  };

  return {
    count: data?.count || 0,
    totalExpected: data?.totalExpected || 0,
    remainingCompanies: data?.remainingCompanies || 0,
    remainingAmount: data?.remainingAmount || 0,
    error,
    loading,
    refresh,
  };
};
