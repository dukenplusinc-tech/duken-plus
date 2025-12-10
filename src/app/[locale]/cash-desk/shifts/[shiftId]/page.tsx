import type { Metadata } from 'next';

import ShiftDetail from './shift-detail';

export const metadata: Metadata = {
  title: 'Shift Details',
  description: 'View shift details and transactions',
};

export default async function ShiftDetailPage({
  params,
}: {
  params: Record<'shiftId' | 'locale', string>;
}) {
  return <ShiftDetail shiftId={params.shiftId} />;
}

