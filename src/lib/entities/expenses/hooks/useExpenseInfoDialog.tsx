import { useCallback } from 'react';
import { addDays, format } from 'date-fns';
import { useTranslations } from 'next-intl';

import { ExpenseInfo } from '@/lib/entities/expenses/containers/expense-info';
import { useModalDialog } from '@/lib/primitives/modal/hooks';

export function useExpenseInfoDialog() {
  const t = useTranslations('expenses.info');

  const dialog = useModalDialog();

  const openModal = useCallback(
    (date: string) => {
      dialog.launch({
        dialog: true,
        title: t('title'),
        autoClose: false,
        footer: false,
        render: <ExpenseInfo date={date} />,
      });
    },
    [dialog, t]
  );

  const openYesterday = useCallback(() => {
    const date = format(addDays(new Date(), -1), 'yyyy-MM-dd');
    openModal(date);
  }, [openModal]);

  const openTomorrow = useCallback(() => {
    const date = format(addDays(new Date(), 1), 'yyyy-MM-dd');
    openModal(date);
  }, [openModal]);

  return {
    openYesterday,
    openTomorrow,
  };
}
