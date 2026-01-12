import { useCallback } from 'react';
import useSWR, { mutate } from 'swr';

import { createClient } from '@/lib/supabase/client';

export interface DebtorWithShop {
  id: string;
  full_name: string;
  iin: string;
  phone: string | null;
  address: string | null;
  max_credit_amount: number;
  balance: number;
  work_place: string | null;
  additional_info: string | null;
  created_at: string | null;
  updated_at: string | null;
  shop_id: string;
  blacklist: boolean | null;
  shop_title: string;
}

export const useDebtorsByIin = (iin: string | null | undefined) => {
  const fetcher = async (): Promise<DebtorWithShop[]> => {
    if (!iin) {
      return [];
    }

    const supabase = createClient();

    const { data, error } = await supabase.rpc('get_debtors_by_iin', {
      p_iin: iin,
    });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  };

  const { data, error, isLoading } = useSWR(
    iin ? `debtors-by-iin-${iin}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  const refresh = useCallback(() => {
    if (iin) {
      return mutate(`debtors-by-iin-${iin}`);
    }
  }, [iin]);

  return {
    data: data || [],
    error,
    isLoading,
    refresh,
  };
};
