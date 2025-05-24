'use client';

import { useForm } from '@/lib/composite/form/useForm';
import { createExpense } from '@/lib/entities/expenses/actions/createExpense';
import { updateExpense } from '@/lib/entities/expenses/actions/updateExpense';
import { useExpenseById } from '@/lib/entities/expenses/hooks/useExpenseById';
import { useTotalExpenses } from '@/lib/entities/expenses/hooks/useTotalExpenses';
import { ExpensePayload, expenseSchema } from '@/lib/entities/expenses/schema';

interface ExpenseFormParams {
  id?: string | null;
}

const defaultValues: ExpensePayload = {
  type: '',
  amount: 0,
  date: new Date().toISOString(),
};

export function useExpenseForm({ id }: ExpenseFormParams) {
  const fetcher = useExpenseById(id);
  // const { refresh } = useExpenses();
  const { refresh } = useTotalExpenses();

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
  });
}
