import { useQuery } from '@supabase-cache-helpers/postgrest-swr';

import { createClient } from '@/lib/supabase/client';
import { Database } from '@/lib/supabase/types';

const supabase = createClient();

type Expense = Database['public']['Tables']['expenses']['Row'];

export type CalendarExpense = Pick<Expense, 'id' | 'type' | 'amount'> & {
  date: string; // YYYY-MM-DD (normalized)
  created_at: string; // keep for stable sort if needed
};

export function useCalendarExpenses(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth();

  const startDate = new Date(year, month, 1).toISOString().slice(0, 10);
  const endDate = new Date(year, month + 1, 0).toISOString().slice(0, 10);

  return useQuery<CalendarExpense[]>(
    // @ts-ignore type helper still fine
    supabase
      .from('expenses')
      .select('id, type, amount, date, created_at')
      .gte('date', startDate)
      .lte('date', endDate)
      .order('created_at', { ascending: true }),
    {
      revalidateOnFocus: false,
      transform: (rows: Expense[]) =>
        (rows ?? []).map((r) => ({
          id: r.id,
          type: r.type,
          amount: r.amount as unknown as number,
          // normalize to YYYY-MM-DD (works whether timestamp or date)
          date: (r as any).date?.toString()?.slice(0, 10) ?? '',
          created_at: (r as any).created_at?.toString() ?? '',
        })),
    }
  );
}
