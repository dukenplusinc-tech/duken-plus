import type { Metadata } from 'next';

import { redirectIfNotAllowed } from '@/lib/auth/guard/auth/actions/redirectIfNotAllowed';
import { RoleScope } from '@/lib/entities/roles/types';
import { UsersTable } from '@/lib/entities/users/containers/users-table';

export const metadata: Metadata = {
  title: 'Users',
  description: 'Manage your users and view their details',
};

export default async function UsersPage() {
  await redirectIfNotAllowed(RoleScope.users);

  return <UsersTable />;
}
