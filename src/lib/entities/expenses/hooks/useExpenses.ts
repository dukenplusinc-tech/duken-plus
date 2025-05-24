'use client';

import { Expense } from '@/lib/entities/expenses/schema';
import { useInfiniteQuery } from '@/lib/supabase/useInfiniteQuery';

export const useExpenses = () => {
  return useInfiniteQuery<Expense>({
    table: 'expenses',
    columns: `
      id,
      type,
      amount,
      date,
      created_at
    `,
    limit: 20,
    filters: [],
  });
};
