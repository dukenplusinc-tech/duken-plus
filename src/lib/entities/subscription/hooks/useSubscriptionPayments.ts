'use client';

import type { SubscriptionPayment } from '@/lib/entities/subscription/schema'; // Update the schema import
import { useInfiniteQuery } from '@/lib/supabase/useInfiniteQuery';

export const useSubscriptionPayments = () => {
  return useInfiniteQuery<SubscriptionPayment>({
    table: 'subscription_payments',
    columns: `
      id,
      shop_id,
      amount,
      date,
      started_from,
      available_until,
      transaction_id,
      payment_method,
      note
    `,
    limit: 20,
  });
};
