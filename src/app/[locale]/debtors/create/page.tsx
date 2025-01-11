import type { Metadata } from 'next';

import { DebtorPageForm } from '@/lib/entities/debtors/containers/create';

export const metadata: Metadata = {
  title: 'Add new Debtor',
  description: 'Manage your data',
};

export default async function AddPage() {
  return <DebtorPageForm />;
}
