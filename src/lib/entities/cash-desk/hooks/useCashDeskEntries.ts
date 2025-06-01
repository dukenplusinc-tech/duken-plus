import { useMemo } from 'react';

import { ActiveFilter } from '@/lib/composite/filters/context';
import { CashRegister } from '@/lib/entities/cash-desk/schema';
import { useInfiniteQuery } from '@/lib/supabase/useInfiniteQuery';

export const useCashDeskEntries = (
  type: CashRegister['type'] | null = null
) => {
  const filters: ActiveFilter[] = useMemo(() => {
    if (!type) {
      return [];
    }

    return [
      {
        key: 'type',
        eq: type,
      },
    ];
  }, [type]);

  return useInfiniteQuery<CashRegister>({
    table: 'cash_register',
    columns: `
      id,
      type,
      bank_name,
      amount,
      from,
      date,
      added_by
    `,
    filters,
  });
};
