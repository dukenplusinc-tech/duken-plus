import type { Metadata } from 'next';

import { ConsignmentTable } from '@/lib/entities/deliveries/containers/deliveries-table/consignments';

export const metadata: Metadata = {
  title: 'Consignments',
  description: '',
};

export default async function DeliveriesPage() {
  return <ConsignmentTable />;
}
