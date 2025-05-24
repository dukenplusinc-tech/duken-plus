'use client';

import type { BankName } from '@/lib/entities/cash-desk/schema';
import { useQuery } from '@/lib/supabase/query';

export const useBankNames = () => {
  const { data, error, isLoading, refresh } = useQuery<BankName[]>(
    'bank_names_view',
    'bank_name'
  );

  return {
    banks: data?.map((b) => b.bank_name) ?? [],
    isLoading,
    error,
    refresh,
  };
};
