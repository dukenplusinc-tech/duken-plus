'use client';

import { shop } from '@/config/shop';
import {
  shopPayloadSchema as schema,
  ShopPayload,
} from '@/lib/entities/shop/schema';
import { useQueryById } from '@/lib/supabase/useQueryById';

export const useShop = () => {
  return useQueryById<ShopPayload>(
    shop.hardcodedId, // hardcoded for now
    'shops',
    `
      id,
      title,
      address,
      city
      `,
    {
      schema,
    }
  );
};
