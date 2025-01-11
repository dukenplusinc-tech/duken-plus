import type { Metadata } from 'next';

import { DebtorsTable } from '@/lib/entities/debtors/containers/debtors-table';

export const metadata: Metadata = {
  title: 'Debtors',
  description: 'Manage your data',
};

export default async function DebtorsPage() {
  return <DebtorsTable />;
}
