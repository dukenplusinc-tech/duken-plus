'use client';

import {
  DebtorPayload,
  debtorPayloadSchema as schema,
} from '@/lib/entities/debtors/schema';
import { useQueryById } from '@/lib/supabase/useQueryById';

export const useDebtorById = (id: string | null = null) => {
  return useQueryById<DebtorPayload>(
    id,
    'debtors',
    `
        full_name,
        iin,
        blacklist,
        phone,
        address,
        max_credit_amount,
        balance,
        work_place,
        additional_info,
        created_at,
        updated_at,
        shop_id
      `,
    {
      schema,
    }
  );
};
