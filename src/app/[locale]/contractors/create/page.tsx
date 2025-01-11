import type { Metadata } from 'next';

import { ContractorPage } from '@/lib/entities/contractors/containers/contractor-create';

export const metadata: Metadata = {
  title: 'Add new Contactor',
  description: 'Manage your data',
};

export default async function AddContractorPage() {
  return <ContractorPage />;
}
