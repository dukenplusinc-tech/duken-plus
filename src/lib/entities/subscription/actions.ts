import { createClient } from '@/lib/supabase/server';

export async function checkSubscription(shop_id: string) {
  const supabase = createClient();

  // Check the user's subscription status
  const { data: subscriptionData, error: subscriptionError } = await supabase
    .from('subscription_payments')
    .select('available_until')
    .eq('shop_id', shop_id) // Assuming user has `shop_id`
    .order('date', { ascending: false }) // Get the latest payment
    .limit(1);

  if (subscriptionError) {
    console.error('Error checking subscription:', subscriptionError);
    return false; // Handle error by returning false
  }

  const subscription = subscriptionData?.[0];
  if (!subscription || !subscription.available_until) {
    return false; // No subscription or missing available_until
  }

  const availableUntil = new Date(subscription.available_until);
  const currentDate = new Date();

  // Check if subscription is expired
  return availableUntil >= currentDate;
}
