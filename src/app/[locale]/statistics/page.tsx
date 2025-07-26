import type { Metadata } from 'next';

import { StatsPage } from '@/lib/entities/statistics/containers/shop-statistics';

export const metadata: Metadata = {
  title: 'Statistics',
  description: '',
};

export default async function DeliveriesPage() {
  return <StatsPage />;
}
