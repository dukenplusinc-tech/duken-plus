import { useCallback } from 'react';
import useSWR, { mutate } from 'swr';

import { createClient } from '@/lib/supabase/client';

export const useExpenseTypes = () => {
  const fetcher = async () => {
    const supabase = createClient();

    const { data, error } = await supabase.rpc('distinct_expense_types');

    if (error) {
      throw new Error(error.message);
    }

    return data.map((entry) => entry.type);
  };

  const { data, error, isLoading } = useSWR('expense-types', fetcher, {
    revalidateOnFocus: false,
  });

  const refresh = useCallback(() => {
    return mutate('expense-types');
  }, []);

  return {
    types: data || [],
    error,
    isLoading,
    refresh,
  };
};
