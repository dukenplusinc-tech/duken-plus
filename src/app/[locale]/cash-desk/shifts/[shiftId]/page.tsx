import type { Metadata } from 'next';

import ShiftDetail from './shift-detail';

export const metadata: Metadata = {
  title: 'Shift Details',
  description: 'View shift details and transactions',
};

export default async function ShiftDetailPage({
  params,
}: {
  params: Promise<Record<'shiftId' | 'locale', string>>;
}) {
  const { shiftId } = await params;
  return <ShiftDetail shiftId={shiftId} />;
}

