import { useCallback, useRef } from 'react';
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

  const formRef = useRef<HTMLDivElement>(null);

  return useCallback(
    (balance?: number) =>
      dialog.launch({
        dialog: true,
        autoClose: false,
        title,
        render: (
          <div ref={formRef}>
            <TransactionForm id={id} debtor_id={debtor_id} balance={balance} />
          </div>
        ),
        onCancel: () => {
          dialog.close();
        },
        onAccept: () => {
          const wrapper = formRef.current;

          if (!wrapper) {
            return;
          }

          // workaround to trigger form submit
          const element = wrapper.querySelector<HTMLInputElement>(
            'form input[type=submit]'
          );

          if (element) {
            element.click();
          }
        },
      }),
    [debtor_id, dialog, id, title]
  );
}
