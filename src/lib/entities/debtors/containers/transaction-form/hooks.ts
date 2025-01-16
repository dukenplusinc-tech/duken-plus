import { useMemo } from 'react';
import { useTranslations } from 'next-intl';

import { FormValidationError } from '@/lib/composite/form/errors';
import { useForm } from '@/lib/composite/form/useForm';
import { createDebtorTransaction } from '@/lib/entities/debtors/actions/createDebtorTransaction';
import { updateDebtorTransaction } from '@/lib/entities/debtors/actions/updateDebtorTransaction';
import { useDebtorById } from '@/lib/entities/debtors/hooks/useDebtorById';
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
  const t = useTranslations('errors');

  const fetcher = useDebtorTransactionById(id);

  const { data: debtor } = useDebtorById(debtor_id);

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
        const limit = debtor?.max_credit_amount;
        const currentBalance = debtor?.balance;

        // check for `max_credit_amount` limit
        if (
          values.transaction_type === TransactionType.loan &&
          limit &&
          currentBalance
        ) {
          const pendingBalance = currentBalance - values.amount;

          const canTakeInLoan = pendingBalance >= -1 * limit;

          if (!canTakeInLoan) {
            throw new FormValidationError(t('rules.limit_exceeded', { limit }));
          }
        }

        await createDebtorTransaction(values);

        await Promise.all([refreshDebtors(), refreshBlacklist()]);
      }

      await refresh();
    },
    schema: debtorTransactionSchema,
  });
}
