'use client';

import type { DebtorTransaction } from '@/lib/entities/debtors/schema';
import { useInfiniteQuery } from '@/lib/supabase/useInfiniteQuery';

export const useDebtorTransactions = () => {
  return useInfiniteQuery<DebtorTransaction>({
    table: 'debtor_transactions',
    columns: `
      id,
      debtor_id,
      transaction_type,
      amount,
      transaction_date,
      description,
      debtor:debtors (
        full_name
      )
    `,
    limit: 20,
  });
};
