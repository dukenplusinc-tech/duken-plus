'use client';

import { useMemo } from 'react';

import type { CashStats } from '@/lib/entities/cash-desk/schema';
import { useQuery } from '@/lib/supabase/query';

export const useCashDeskStat = () => {
  const { data, refresh, isLoading, error } = useQuery<CashStats[]>(
    'cash_register_ui_view',
    `
      shop_id,
      total_amount,
      cash_total,
      bank_total,
      banks
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
