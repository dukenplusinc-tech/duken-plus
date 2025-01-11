'use client';

import {
  ContractorPayload,
  contractorPayloadSchema as schema,
} from '@/lib/entities/contractors/schema';
import { useQueryById } from '@/lib/supabase/useQueryById';

export const useContractorById = (id: string | null = null) => {
  return useQueryById<ContractorPayload>(
    id,
    'contractors',
    `
        title,
        supervisor,
        supervisor_phone,
        sales_representative,
        sales_representative_phone,
        address,
        note,
        shop_id
      `,
    {
      schema,
    }
  );
};
