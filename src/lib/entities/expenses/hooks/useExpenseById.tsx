'use client';

import {
  Expense,
  expenseSchema as schema,
} from '@/lib/entities/expenses/schema';
import { useQueryById } from '@/lib/supabase/useQueryById';

export const useExpenseById = (id: string | null = null) => {
  return useQueryById<Expense>(
    id,
    'expenses',
    `
      id,
      type,
      amount,
      date,
      created_at
    `,
    {
      schema,
    }
  );
};
