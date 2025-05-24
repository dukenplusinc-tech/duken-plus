import { useState } from 'react';
import { format } from 'date-fns';
import useSWR, { mutate } from 'swr';

import { createClient } from '@/lib/supabase/client';

// Function to fetch expenses for a given date
const fetchExpenses = async (date: string) => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('expenses')
    .select('amount, date')
    .gte('date', date) // Filter records based on date
    .lt('date', date + ' 23:59:59'); // Ensure we're capturing the full day range

  if (error) {
    console.error('Error fetching expenses:', error);
    return 0;
  }

  return (
    data?.reduce(
      (acc: number, expense: { amount: number }) => acc + expense.amount,
      0
    ) || 0
  );
};

export const useTotalExpenses = () => {
  // Fetch total expenses for yesterday, today, and tomorrow using SWR
  const { data: totalYesterday, error: errorYesterday } = useSWR(
    'totalYesterday',
    async () => {
      const yesterday = format(
        new Date(Date.now() - 24 * 60 * 60 * 1000),
        'yyyy-MM-dd'
      ); // Get yesterday's date
      return fetchExpenses(yesterday);
    },
    { revalidateOnFocus: false, dedupingInterval: 60 * 1000 } // Adjusted deduplication
  );

  const { data: totalToday, error: errorToday } = useSWR(
    'totalToday',
    async () => {
      const today = format(new Date(), 'yyyy-MM-dd'); // Get today's date
      return fetchExpenses(today);
    },
    { revalidateOnFocus: false, dedupingInterval: 60 * 1000 } // Adjusted deduplication
  );

  const { data: totalTomorrow, error: errorTomorrow } = useSWR(
    'totalTomorrow',
    async () => {
      const tomorrow = format(
        new Date(Date.now() + 24 * 60 * 60 * 1000),
        'yyyy-MM-dd'
      ); // Get tomorrow's date
      return fetchExpenses(tomorrow);
    },
    { revalidateOnFocus: false, dedupingInterval: 60 * 1000 } // Adjusted deduplication
  );

  const [loading, setLoading] = useState(false);

  // Function to revalidate expenses manually after adding or updating
  const refresh = async () => {
    setLoading(true);
    await mutate('totalYesterday'); // Trigger revalidation for yesterday's expenses
    await mutate('totalToday'); // Trigger revalidation for today's expenses
    await mutate('totalTomorrow'); // Trigger revalidation for tomorrow's expenses
    setLoading(false);
  };

  return {
    totalYesterday: totalYesterday || 0,
    totalToday: totalToday || 0,
    totalTomorrow: totalTomorrow || 0,
    errorYesterday,
    errorToday: errorToday,
    errorTomorrow,
    loading,
    refresh,
  };
};
