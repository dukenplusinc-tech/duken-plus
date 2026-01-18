import { useState } from 'react';
import { format } from 'date-fns';
import useSWR, { mutate } from 'swr';

import { createClient } from '@/lib/supabase/client';
import { getAccountingDate } from '@/lib/entities/deliveries/utils/date';

// --- total including expenses + deliveries ---
const fetchTotal = async (date: string) => {
  const supabase = createClient();

  const [expensesRes, deliveriesRes] = await Promise.all([
    supabase
      .from('expenses')
      .select('amount')
      // FIX: timezone-proof daily filter
      .filter('date', 'gte', `${date} 00:00:00`)
      .filter('date', 'lte', `${date} 23:59:59.999`),

    supabase
      .from('deliveries')
      .select('*, contractors ( title )')
      .in('status', ['pending', 'accepted'])
      .or(`expected_date.eq.${date},and(status.eq.accepted,accepted_date.eq.${date})`),
  ]);

  const expenses = expensesRes.data || [];
  const deliveries = deliveriesRes.data || [];

  // Filter deliveries by accounting date (use accepted_date for overdue accepted)
  const filteredDeliveries = deliveries.filter((d) => {
    const accountingDate = getAccountingDate(d);
    return accountingDate === date;
  });

  const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);

  const totalDeliveries = filteredDeliveries.reduce(
    (sum, d) => sum + Number(d.amount_received ?? d.amount_expected ?? 0),
    0
  );

  return totalExpenses + totalDeliveries;
};

// --- accepted deliveries + expenses ---
const fetchAcceptedOnlySum = async (date: string) => {
  const supabase = createClient();

  const [expensesRes, deliveriesRes] = await Promise.all([
    supabase
      .from('expenses')
      .select('amount')
      // FIX: timezone-proof daily filter
      .filter('date', 'gte', `${date} 00:00:00`)
      .filter('date', 'lte', `${date} 23:59:59.999`),

    supabase
      .from('deliveries')
      .select('amount_expected, amount_received, status, expected_date, accepted_date')
      .eq('status', 'accepted')
      .or(`expected_date.eq.${date},accepted_date.eq.${date}`),
  ]);

  const expenses = expensesRes.data || [];
  const deliveries = deliveriesRes.data || [];

  // Filter deliveries by accounting date (use accepted_date for overdue accepted)
  const filteredDeliveries = deliveries.filter((d) => {
    const accountingDate = getAccountingDate(d);
    return accountingDate === date;
  });

  const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);

  const totalDeliveries = filteredDeliveries.reduce(
    (sum, d) => sum + Number(d.amount_received ?? d.amount_expected ?? 0),
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

  const { data: spentTodayAccepted } = useSWR(
    'spentTodayAccepted',
    () => fetchAcceptedOnlySum(formatDate(0)),
    { revalidateOnFocus: false, dedupingInterval: 60 * 1000 }
  );

  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    setLoading(true);
    await Promise.all([
      mutate('totalYesterday'),
      mutate('totalToday'),
      mutate('totalTomorrow'),
      mutate('spentTodayAccepted'),
    ]);
    setLoading(false);
  };

  return {
    totalYesterday: totalYesterday || 0,
    totalToday: totalToday || 0,
    totalTomorrow: totalTomorrow || 0,
    spentTodayAccepted: spentTodayAccepted || 0,
    loading,
    refresh,
  };
};
