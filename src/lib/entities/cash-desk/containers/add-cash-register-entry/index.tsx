import { useCallback } from 'react';
import { useTranslations } from 'next-intl';

import { useModalDialog } from '@/lib/primitives/modal/hooks';

import { AddCashRegisterEntry, AddCashRegisterEntryProps } from './form';

export function useAddCashRegisterEntryForm() {
  const t = useTranslations('debtor_transactions.form');

  const dialog = useModalDialog();

  let title = t('create_title');

  return useCallback(
    (props: AddCashRegisterEntryProps) =>
      dialog.launch({
        dialog: true,
        autoClose: false,
        footer: false,
        title,
        render: <AddCashRegisterEntry {...props} />,
      }),
    [dialog, title]
  );
}
