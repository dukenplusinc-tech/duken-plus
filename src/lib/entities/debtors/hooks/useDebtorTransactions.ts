'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';

import { ActiveFilter } from '@/lib/composite/filters/context';
import type { DebtorTransaction } from '@/lib/entities/debtors/schema';
import { useInfiniteQuery } from '@/lib/supabase/useInfiniteQuery';

export const useDebtorTransactions = () => {
  const searchParams = useSearchParams();

  const debtor_id = searchParams.get('debtor_id');

  const filters = useMemo(() => {
    const list: ActiveFilter[] = [];

    if (debtor_id) {
      list.push({
        key: 'debtor_id',
        eq: debtor_id,
      });
    }

    return list;
  }, [debtor_id]);

  return useInfiniteQuery<DebtorTransaction>({
    table: 'debtor_transactions',
    columns: `
      id,
      debtor_id,
      transaction_type,
      amount,
      transaction_date,
      description,
      added_by,
      debtor:debtors (
        full_name
      )
    `,
    limit: 20,
    filters,
  });
};
