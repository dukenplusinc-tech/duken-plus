'use client';

import { useMemo } from 'react';

import type { BankName } from '@/lib/entities/cash-desk/schema';
import { useQuery } from '@/lib/supabase/query';

export const useBankNames = () => {
  const { data, error, isLoading, refresh } = useQuery<BankName[]>(
    'bank_names_view',
    'bank_name',
    {
      sort: [],
    }
  );

  const banks = useMemo(() => {
    const ignoreList = ['kaspi', 'halyk', 'каспи', 'халык'] as string[];

    return (data || [])
      .map((b) => b.bank_name)
      .filter((bank) => !ignoreList.includes(bank.toLowerCase()));
  }, [data]);

  return {
    banks,
    isLoading,
    error,
    refresh,
  };
};
