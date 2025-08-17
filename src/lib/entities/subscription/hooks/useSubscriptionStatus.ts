'use client';

import useSWR from 'swr';

import { createClient } from '@/lib/supabase/client';

interface SubscriptionPayment {
  id: string;
  shop_id: string;
  amount: number;
  date: string;
  started_from: string | null;
  available_until: string;
  transaction_id: string;
  payment_method: string;
  note: string | null;
}

export interface SubscriptionInfo extends SubscriptionPayment {
  isActive: boolean;
  daysRemaining: number;
}

// Define the fetcher function to get subscription data from Supabase
const fetchSubscriptionData = async (
  shopId: string
): Promise<SubscriptionPayment[]> => {
  const { data, error } = await createClient()
    .from('subscription_payments')
    .select('*')
    .eq('shop_id', shopId)
    .order('date', { ascending: false }) // Get the latest payment
    .limit(1);

  if (error) {
    throw error;
  }

  return data as SubscriptionPayment[];
};

export const useSubscriptionStatus = (shopId: string) => {
  const { data, error, isValidating } = useSWR<SubscriptionPayment[]>(
    shopId ? [`subscription_payments`, shopId] : null,
    () => fetchSubscriptionData(shopId),
    {
      revalidateOnFocus: false,
      refreshInterval: 0,
      dedupingInterval: 60000, // Only re-fetch every 1 minute
    }
  );

  // Compute the subscription status based on available_until
  const subscription = data?.length ? data[0] : null;
  let isActive = false;
  let daysRemaining = 0;

  if (subscription) {
    const availableUntil = new Date(subscription.available_until);
    const currentDate = new Date();
    isActive = availableUntil > currentDate;
    daysRemaining = Math.ceil(
      (availableUntil.getTime() - currentDate.getTime()) / (1000 * 3600 * 24)
    ); // Calculate days remaining
  }

  return {
    subscription: {
      ...subscription,
      isActive,
      daysRemaining,
    } as SubscriptionInfo,
    isLoading: !data && !error,
    isValidating,
    error,
  };
};
