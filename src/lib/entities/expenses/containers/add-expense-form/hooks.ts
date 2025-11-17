'use client';

import { useTranslations } from 'next-intl';

import { useForm } from '@/lib/composite/form/useForm';
import { createExpense } from '@/lib/entities/expenses/actions/createExpense';
import { updateExpense } from '@/lib/entities/expenses/actions/updateExpense';
import { useExpenseById } from '@/lib/entities/expenses/hooks/useExpenseById';
import { ExpensePayload, expenseSchema } from '@/lib/entities/expenses/schema';
import { useRefreshHomeData } from '@/lib/entities/home/hooks/useRefreshHomeData';

interface ExpenseFormParams {
  id?: string | null;
}

const defaultValues: ExpensePayload = {
  type: '',
  amount: 0,
  date: new Date().toISOString(),
};

export function useExpenseForm({ id }: ExpenseFormParams) {
  const t = useTranslations('validation.success');
  const fetcher = useExpenseById(id);
  const refresh = useRefreshHomeData();

  return useForm<typeof expenseSchema, ExpensePayload>({
    defaultValues,
    fetcher,
    request: async (values) => {
      if (id) {
        await updateExpense(id, values);
      } else {
        await createExpense(values);
      }

      await refresh();
    },
    schema: expenseSchema,
    successMessage: {
      title: id ? t('saved_title') : t('expense_added_title'),
      description: id ? t('saved_description') : t('expense_added_description'),
    },
  });
}
