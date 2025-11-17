'use client';

import { useMemo } from 'react';

import type { DebtorStats } from '@/lib/entities/debtors/schema';
import { useQuery } from '@/lib/supabase/query';

export const useDebtorStats = () => {
  const { data, refresh, isLoading, error } = useQuery<DebtorStats[]>(
    'debtor_statistics',
    `
      shop_id,
      total_debtors,
      overdue_debtors,
      total_positive_balance,
      total_negative_balance
    `,
    {
      sort: [],
      allowedFilters: [],
    }
  );

  return useMemo(() => {
    const prepared = data?.length ? data[0] : null;

    return {
      data: prepared,
      refresh,
      isLoading,
      error,
    };
  }, [data, error, isLoading, refresh]);
};
