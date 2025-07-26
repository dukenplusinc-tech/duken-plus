'use client';

import { useMemo } from 'react';
import useSWR from 'swr';

import { createClient } from '@/lib/supabase/client';

type Period = 'day' | 'week' | 'month' | 'year';

export const useStats = (period: Period) => {
  const supabase = createClient();

  const { data, error, isLoading } = useSWR(['stats', period], async () => {
    const fromDate = new Date();
    if (period === 'day') fromDate.setDate(fromDate.getDate() - 1);
    if (period === 'week') fromDate.setDate(fromDate.getDate() - 7);
    if (period === 'month') fromDate.setMonth(fromDate.getMonth() - 1);
    if (period === 'year') fromDate.setFullYear(fromDate.getFullYear() - 1);

    const fromIso = fromDate.toISOString();

    const [expensesRes, deliveriesRes] = await Promise.all([
      supabase
        .from('expenses')
        .select('amount, created_at')
        .gte('created_at', fromIso),
      supabase
        .from('deliveries')
        .select('amount_received, created_at')
        .is('amount_received', null)
        .gte('created_at', fromIso),
    ]);

    if (expensesRes.error || deliveriesRes.error) {
      throw new Error('Failed to load stats');
    }

    const expenses = expensesRes.data || [];
    const deliveries = deliveriesRes.data || [];

    const loanedOut = expenses
      .filter((e) => e.amount > 0)
      .reduce((acc, e) => acc + e.amount, 0);
    const repaid = expenses
      .filter((e) => e.amount < 0)
      .reduce((acc, e) => acc + e.amount, 0);
    const toFirms = deliveries.reduce(
      (acc, d) => acc + (d.amount_received ?? 0),
      0
    );

    const cashRegisters = expenses.length;

    return {
      loanedOut,
      repaid: Math.abs(repaid),
      toFirms,
      cashRegisters,
    };
  });

  return useMemo(() => {
    return {
      stats: data,
      isLoading,
      error,
    };
  }, [data, isLoading, error]);
};
