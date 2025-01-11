import type { Metadata } from 'next';

import { DebtorHistoryTable } from '@/lib/entities/debtors/containers/debtor-history-table';

export const metadata: Metadata = {
  title: 'Debtor History',
  description: 'Manage your data',
};

export default async function HistoryPage() {
  return <DebtorHistoryTable />;
}
