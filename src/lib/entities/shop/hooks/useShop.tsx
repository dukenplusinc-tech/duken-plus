'use client';

import {
  shopPayloadSchema as schema,
  ShopPayload,
} from '@/lib/entities/shop/schema';
import { useProfile } from '@/lib/entities/users/hooks/useUser';
import { useQueryById } from '@/lib/supabase/useQueryById';

export const useShopID = () => {
  const { data: profile } = useProfile();

  return profile?.shop_id || null;
};

export const useShop = () => {
  const { data: profile } = useProfile();

  return useQueryById<ShopPayload>(
    profile?.shop_id,
    'shops',
    `
      id,
      title,
      address,
      city,
      code,
      created_at
      `,
    {
      schema,
    }
  );
};
