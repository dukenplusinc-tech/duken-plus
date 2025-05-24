import type { Metadata } from 'next';

import { SubscriptionInfo } from './subscription-info';

export const metadata: Metadata = {
  title: 'Subscription',
  description: 'Manage your cash desk',
};

export default async function SubscriptionPage() {
  return <SubscriptionInfo />;
}
