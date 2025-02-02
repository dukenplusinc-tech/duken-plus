import type { Metadata } from 'next';

import { redirectIfNotAllowed } from '@/lib/auth/guard/auth/actions/redirectIfNotAllowed';
import { EmployeeForm } from '@/lib/entities/employees/containers/create-employee/form';
import { RoleScope } from '@/lib/entities/roles/types';

export const metadata: Metadata = {
  title: 'User Page',
  description: 'Manage your users and view their details',
};

export default async function EmployeeEditPage({
  params: { id },
}: {
  params: { id: string };
}) {
  await redirectIfNotAllowed(RoleScope.users);

  return <EmployeeForm id={id} />;
}
