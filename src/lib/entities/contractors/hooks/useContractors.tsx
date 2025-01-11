'use client';

import { Contractor } from '@/lib/entities/contractors/schema';
import { useInfiniteQuery } from '@/lib/supabase/useInfiniteQuery';

export const useContractors = () => {
  return useInfiniteQuery<Contractor>({
    table: 'contractors',
    columns: `
      id,
      title,
      supervisor,
      supervisor_phone,
      sales_representative,
      sales_representative_phone,
      address,
      contract,
      note,
      shop_id,
      created_at,
      updated_at
    `,
  });
};
