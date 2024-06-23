import type { Metadata } from 'next';

import { redirectIfNotAllowed } from '@/lib/auth/guard/auth/actions/redirectIfNotAllowed';
import { RoleScope } from '@/lib/entities/roles/types';
import { CreateUserDialog } from '@/lib/entities/users/containers/create-user';
import { UsersTable } from '@/lib/entities/users/containers/users-table';

export const metadata: Metadata = {
  title: 'Users',
  description: 'Manage your users and view their details',
};

export default async function UsersPage() {
  await redirectIfNotAllowed(RoleScope.users);

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Users</h2>
          <p className="text-muted-foreground">
            Manage your users and view their details
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <CreateUserDialog />
        </div>
      </div>
      <UsersTable />
    </div>
  );
}
