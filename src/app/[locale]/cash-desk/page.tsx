import type { Metadata } from 'next';

import { EmployeeMode } from '@/lib/entities/employees/containers/employee-mode';

export const metadata: Metadata = {
  title: 'Cash Desk',
  description: 'Manage your cash desk',
};

export default async function CashDeskPage() {
  return <EmployeeMode>Cash Desk</EmployeeMode>;
}
