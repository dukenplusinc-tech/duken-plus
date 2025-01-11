'use client';

import {
  DebtorTransactionPayload,
  debtorTransactionSchema as schema,
} from '@/lib/entities/debtors/schema';
import { useQueryById } from '@/lib/supabase/useQueryById';

export const useDebtorTransactionById = (id: string | null = null) => {
  return useQueryById<DebtorTransactionPayload>(
    id,
    'debtor_transactions',
    `
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
    {
      schema,
    }
  );
};
