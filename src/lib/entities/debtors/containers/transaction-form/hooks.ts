import { useMemo } from 'react';
import { useTranslations } from 'next-intl';

import { FormValidationError } from '@/lib/composite/form/errors';
import { useForm } from '@/lib/composite/form/useForm';
import { createDebtorTransaction } from '@/lib/entities/debtors/actions/createDebtorTransaction';
import { updateDebtorTransaction } from '@/lib/entities/debtors/actions/updateDebtorTransaction';
import { useAddedBy } from '@/lib/entities/debtors/hooks/useAddedBy';
import { useDebtorById } from '@/lib/entities/debtors/hooks/useDebtorById';
import { useDebtors } from '@/lib/entities/debtors/hooks/useDebtors';
import { useDebtorStats } from '@/lib/entities/debtors/hooks/useDebtorStats';
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
  const t = useTranslations('validation.errors');

  const fetcher = useDebtorTransactionById(id);

  const { data: debtor } = useDebtorById(debtor_id);

  const { refresh: refreshDebtors } = useDebtors();
  const { refresh } = useDebtorTransactions();
  const { refresh: refreshStats } = useDebtorStats();

  const defaultValues: DebtorTransactionPayload = useMemo(() => {
    const amount = balance ? Math.abs(balance) : 0;

    return {
      transaction_type: amount ? TransactionType.payback : TransactionType.loan,
      debtor_id: debtor_id || '',
      amount,
      description: '',
      added_by: '',
    };
  }, [balance, debtor_id]);

  const added_by = useAddedBy();

  return useForm<typeof debtorTransactionSchema, DebtorTransactionPayload>({
    defaultValues,
    fetcher,
    request: async (values) => {
      values.added_by = added_by;

      if (id) {
        await updateDebtorTransaction(id, values);
      } else {
        const limit = debtor?.max_credit_amount;
        const currentBalance = debtor?.balance;

        // check for `max_credit_amount` limit
        if (values.transaction_type === TransactionType.loan && limit) {
          const pendingBalance = currentBalance - values.amount;

          const canTakeInLoan = pendingBalance >= -1 * limit;

          if (!canTakeInLoan) {
            throw new FormValidationError(t('rules.limit_exceeded', { limit }));
          }
        }

        await createDebtorTransaction(values);

        await Promise.all([refreshDebtors(), refreshStats()]);
      }

      await refresh();
    },
    schema: debtorTransactionSchema,
  });
}
