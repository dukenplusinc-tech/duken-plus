import type { Metadata } from 'next';

import { DebtorPageForm } from '@/lib/entities/debtors/containers/create';

export const metadata: Metadata = {
  title: 'Edit Contactor',
  description: 'Manage your data',
};

export default async function EditContractorPage({
  params,
}: {
  params: Record<'id' | 'locale', string>;
}) {
  return <DebtorPageForm id={params.id} />;
}
