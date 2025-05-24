'use client';

import { useCallback } from 'react';
import { useTranslations } from 'next-intl';

import { ExpenseForm } from '@/lib/entities/expenses/containers/add-expense-form/form';
import { useExpenseById } from '@/lib/entities/expenses/hooks/useExpenseById';
import { useModalDialog } from '@/lib/primitives/modal/hooks';

export function useExpenseFormLauncher({ id }: { id?: string } = {}) {
  const t = useTranslations('expenses');

  const dialog = useModalDialog();
  const { data } = useExpenseById(id || null);

  const title = data?.type
    ? `${data.type} – ${new Date(data.date).toLocaleDateString()}`
    : t('dialog.title');

  return useCallback(() => {
    dialog.launch({
      dialog: true,
      title,
      autoClose: false,
      footer: false,
      render: <ExpenseForm id={id} />,
    });
  }, [dialog, id, title]);
}
