import { useCallback } from 'react';
import { useTranslations } from 'next-intl';

import {
  TransactionForm,
  TransactionFormProps,
} from '@/lib/entities/debtors/containers/transaction-form/form';
import { useDebtorTransactionById } from '@/lib/entities/debtors/hooks/useDebtorTransactionById';
import { useModalDialog } from '@/lib/primitives/modal/hooks';

export function useTransactionForm({ id, debtor_id }: TransactionFormProps) {
  const t = useTranslations('debtor_transactions.form');

  const dialog = useModalDialog();
  const { data } = useDebtorTransactionById(id);

  let title = t('create_title');

  if (data) {
    const transaction_date = new Date(
      data.transaction_date!
    ).toLocaleDateString();

    title = `${data?.debtor?.full_name} - ${transaction_date}`;
  }

  return useCallback(
    (balance?: number, prefillForm = false) =>
      dialog.launch({
        dialog: true,
        autoClose: false,
        footer: false,
        title,
        render: (
          <TransactionForm
            id={id}
            prefillForm={prefillForm}
            debtor_id={debtor_id}
            balance={balance}
          />
        ),
      }),
    [debtor_id, dialog, id, title]
  );
}
