import type { Metadata } from 'next';

import { ContractorPage } from '@/lib/entities/contractors/containers/contractor-create';

export const metadata: Metadata = {
  title: 'Edit Contactor',
  description: 'Manage your data',
};

export default async function EditContractorPage({
  params,
}: {
  params: Record<'id' | 'locale', string>;
}) {
  return <ContractorPage id={params.id} />;
}
