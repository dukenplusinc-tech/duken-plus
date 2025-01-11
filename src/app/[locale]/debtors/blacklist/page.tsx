import type { Metadata } from 'next';

import { BlacklistView } from '@/lib/entities/debtors/containers/blacklist-view';

export const metadata: Metadata = {
  title: 'Debtors Blacklist',
  description: 'Manage your data',
};

export default async function DebtorsBlacklistPage() {
  return <BlacklistView />;
}
