'use client';

import {
  shopPayloadSchema as schema,
  ShopPayload,
} from '@/lib/entities/shop/schema';
import { useQueryById } from '@/lib/supabase/useQueryById';

export const useShop = () => {
  return useQueryById<ShopPayload>(
    'c3215c79-991e-433d-b71b-ed8dce6491e4', // hardcoded for now
    'shops',
    `
      title,
      address,
      city
      `,
    {
      schema,
    }
  );
};
