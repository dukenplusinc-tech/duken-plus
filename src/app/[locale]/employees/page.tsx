import type { Metadata } from 'next';

import { redirectIfNotAllowed } from '@/lib/auth/guard/auth/actions/redirectIfNotAllowed';
import { EmployeesTable } from '@/lib/entities/employees/containers/employees-table';
import { RoleScope } from '@/lib/entities/roles/types';

export const metadata: Metadata = {
  title: 'Employees',
  description: 'Manage your employees and view their details',
};

export default async function EmployeesPage() {
  await redirectIfNotAllowed(RoleScope.users);

  return <EmployeesTable />;
}
