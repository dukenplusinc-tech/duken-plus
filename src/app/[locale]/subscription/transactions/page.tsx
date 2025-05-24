import type { Metadata } from 'next';

import { TransactionsTable } from '@/lib/entities/subscription/containers/transactions-table';

export const metadata: Metadata = {
  title: 'Transactions',
  description: 'Manage your data',
};

export default async function TransactionPage() {
  return <TransactionsTable />;
}
