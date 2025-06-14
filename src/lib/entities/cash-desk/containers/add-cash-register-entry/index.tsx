import { useCallback } from 'react';
import { useTranslations } from 'next-intl';

import { CashRegisterType } from '@/lib/entities/cash-desk/schema';
import { useModalDialog } from '@/lib/primitives/modal/hooks';

import { AddCashRegisterEntry, AddCashRegisterEntryProps } from './form';

export function useAddCashRegisterEntryForm() {
  const t = useTranslations('debtor_transactions.form');

  const dialog = useModalDialog();

  return useCallback(
    (props: AddCashRegisterEntryProps) =>
      dialog.launch({
        dialog: true,
        autoClose: false,
        footer: false,
        title:
          props.type === CashRegisterType.CASH
            ? t('fill_in_cash')
            : t('create_title'),
        render: <AddCashRegisterEntry {...props} />,
      }),
    [dialog, t]
  );
}
