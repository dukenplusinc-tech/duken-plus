import { useMemo } from 'react';

import { useForm } from '@/lib/composite/form/useForm';
import { createDebtorTransaction } from '@/lib/entities/debtors/actions/createDebtorTransaction';
import { updateDebtorTransaction } from '@/lib/entities/debtors/actions/updateDebtorTransaction';
import {
  useBlackListedDebtors,
  useDebtors,
} from '@/lib/entities/debtors/hooks/useDebtors';
import { useDebtorTransactionById } from '@/lib/entities/debtors/hooks/useDebtorTransactionById';
import { useDebtorTransactions } from '@/lib/entities/debtors/hooks/useDebtorTransactions';
import {
  DebtorTransactionPayload,
  debtorTransactionSchema,
  TransactionType,
} from '@/lib/entities/debtors/schema';

export interface DebtorTransactionFormParams {
  id?: string;
  debtor_id?: string;
  balance?: number;
}

export function useDebtorTransactionForm({
  id,
  debtor_id,
  balance,
}: DebtorTransactionFormParams) {
  const fetcher = useDebtorTransactionById(id);

  const { refresh: refreshDebtors } = useDebtors();
  const { refresh: refreshBlacklist } = useBlackListedDebtors();
  const { refresh } = useDebtorTransactions();

  const defaultValues: DebtorTransactionPayload = useMemo(() => {
    const amount = balance ? Math.abs(balance) : 0;

    return {
      transaction_type: amount ? TransactionType.payback : TransactionType.loan,
      debtor_id: debtor_id || '',
      amount,
      description: '',
    };
  }, [balance, debtor_id]);

  return useForm<typeof debtorTransactionSchema, DebtorTransactionPayload>({
    defaultValues,
    fetcher,
    request: async (values) => {
      if (id) {
        await updateDebtorTransaction(id, values);
      } else {
        await createDebtorTransaction(values);

        await Promise.all([refreshDebtors(), refreshBlacklist()]);
      }

      await refresh();
    },
    schema: debtorTransactionSchema,
  });
}
