import { useState } from 'react';
import { format } from 'date-fns';
import useSWR, { mutate } from 'swr';

import { createClient } from '@/lib/supabase/client';

const fetchTotal = async (date: string) => {
  const supabase = createClient();

  const [expensesRes, deliveriesRes] = await Promise.all([
    supabase
      .from('expenses')
      .select('amount')
      .gte('date', date)
      .lt('date', date + 'T23:59:59'),

    supabase
      .from('deliveries')
      .select('amount_expected, status')
      .eq('expected_date', date)
      .in('status', ['accepted'])
      .neq('status', 'canceled'),
  ]);

  const expenses = expensesRes.data || [];
  const deliveries = deliveriesRes.data || [];

  const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);

  const totalDeliveries = deliveries.reduce(
    (sum, d) => sum + (d.amount_expected || 0),
    0
  );

  return totalExpenses + totalDeliveries;
};

export const useTotalExpenses = () => {
  const formatDate = (offsetDays: number) =>
    format(
      new Date(Date.now() + offsetDays * 24 * 60 * 60 * 1000),
      'yyyy-MM-dd'
    );

  const { data: totalYesterday } = useSWR(
    'totalYesterday',
    () => fetchTotal(formatDate(-1)),
    { revalidateOnFocus: false, dedupingInterval: 60 * 1000 }
  );

  const { data: totalToday } = useSWR(
    'totalToday',
    () => fetchTotal(formatDate(0)),
    { revalidateOnFocus: false, dedupingInterval: 60 * 1000 }
  );

  const { data: totalTomorrow } = useSWR(
    'totalTomorrow',
    () => fetchTotal(formatDate(1)),
    { revalidateOnFocus: false, dedupingInterval: 60 * 1000 }
  );

  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    setLoading(true);
    await Promise.all([
      mutate('totalYesterday'),
      mutate('totalToday'),
      mutate('totalTomorrow'),
    ]);
    setLoading(false);
  };

  return {
    totalYesterday: totalYesterday || 0,
    totalToday: totalToday || 0,
    totalTomorrow: totalTomorrow || 0,
    loading,
    refresh,
  };
};
