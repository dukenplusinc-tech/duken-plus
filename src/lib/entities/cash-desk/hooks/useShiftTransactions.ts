'use client';

import { useMemo } from 'react';

import { ActiveFilter } from '@/lib/composite/filters/context';
import { CashRegister } from '@/lib/entities/cash-desk/schema';
import { useInfiniteQuery } from '@/lib/supabase/useInfiniteQuery';

export const useShiftTransactions = (shiftId: string | null) => {
  const filters: ActiveFilter[] = useMemo(() => {
    if (!shiftId) {
      return [];
    }

    return [
      {
        key: 'shift_id',
        eq: shiftId,
      },
    ];
  }, [shiftId]);

  return useInfiniteQuery<CashRegister>({
    table: 'cash_register',
    columns: `
      id,
      type,
      bank_name,
      amount,
      from,
      date,
      added_by,
      shift_id
    `,
    filters,
  });
};



