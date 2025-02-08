import type { Metadata } from 'next';

import { EmployeeModeGuard } from '@/lib/entities/employees/containers/employee-mode';

export const metadata: Metadata = {
  title: 'Cash Desk',
  description: 'Manage your cash desk',
};

export default async function CashDeskPage() {
  return <EmployeeModeGuard>Cash Desk</EmployeeModeGuard>;
}
