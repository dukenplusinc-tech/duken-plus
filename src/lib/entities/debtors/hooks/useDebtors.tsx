'use client';

import type { ActiveFilter } from '@/lib/composite/filters/context';
import type { Debtor } from '@/lib/entities/debtors/schema';
import { useInfiniteQuery } from '@/lib/supabase/useInfiniteQuery';

export const useDebtors = () => {
  return useInfiniteQuery<Debtor>({
    table: 'debtors',
    columns: `
      id,
      full_name,
      iin,
      phone,
      address,
      max_credit_amount,
      balance,
      work_place,
      additional_info,
      created_at,
      updated_at,
      shop_id,
      blacklist
    `,
  });
};

const filters: ActiveFilter[] = [
  {
    key: 'blacklist',
    eq: true,
  },
];

export const useBlackListedDebtors = () => {
  return useInfiniteQuery<Debtor>({
    table: 'debtors',
    columns: `
      id,
      full_name,
      iin,
      phone,
      address,
      max_credit_amount,
      balance,
      work_place,
      additional_info,
      created_at,
      updated_at,
      shop_id,
      blacklist
    `,
    filters,
  });
};
