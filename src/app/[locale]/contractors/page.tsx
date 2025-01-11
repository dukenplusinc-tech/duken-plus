import type { Metadata } from 'next';

import { ContractorsTable } from '@/lib/entities/contractors/containers/contractors-table';

export const metadata: Metadata = {
  title: 'Contractors',
  description: 'Manage your contractors',
};

export default async function ContractorsPage() {
  return <ContractorsTable />;
}
