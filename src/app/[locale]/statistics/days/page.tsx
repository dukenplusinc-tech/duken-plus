import type { Metadata } from 'next';

import { DailyStatsPageNew } from '@/lib/entities/statistics/containers/daily-statistics-new';

export const metadata: Metadata = {
  title: 'Daily statistics',
  description: 'Shop statistics by day',
};

export default function StatisticsDaysPage() {
  return <DailyStatsPageNew />;
}


