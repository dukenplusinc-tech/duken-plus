import type { Metadata } from 'next';

import ShiftManagement from './shift-management';

export const metadata: Metadata = {
  title: 'Shift Management',
  description: 'Manage cash shifts',
};

export default async function ShiftsPage() {
  return <ShiftManagement />;
}

