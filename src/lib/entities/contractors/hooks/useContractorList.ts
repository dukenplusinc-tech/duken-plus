import useSWR from 'swr';

import { createClient } from '@/lib/supabase/client';
import type { AutocompleteOption } from '@/components/ui/autocomplete';

export const useContractorList = () => {
  const fetcher = async (): Promise<AutocompleteOption[]> => {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('contractors')
      .select('id, title');

    if (error) {
      throw new Error(error.message);
    }

    return data.map(
      ({ id, title }): AutocompleteOption => ({
        label: title,
        value: id,
      })
    );
  };

  const { data, error, isLoading } = useSWR('expense-types', fetcher, {
    revalidateOnFocus: false,
  });

  return {
    data: data || [],
    error,
    isLoading,
  };
};
