import type { Metadata } from 'next';

import { DeliveriesTable } from '@/lib/entities/suppliers/containers/deliveries-table';

export const metadata: Metadata = {
  title: 'Deliveries',
  description: '',
};

export default async function DeliveriesPage() {
  return <DeliveriesTable />;
}
