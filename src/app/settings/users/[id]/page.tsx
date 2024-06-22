import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { redirectIfNotAllowed } from '@/lib/auth/guard/auth/actions/redirectIfNotAllowed';
import { RoleScope } from '@/lib/entities/roles/types';
import { getProfile } from '@/lib/entities/users/actions/getProfile';
import { UserActionsLog } from '@/lib/entities/users/containers/user-actions-log-table';

export const metadata: Metadata = {
  title: 'User Page',
  description: 'Manage your users and view their details',
};

export default async function UsersPage({
  params: { id },
}: {
  params: { id: string };
}) {
  await redirectIfNotAllowed(RoleScope.users);

  const profile = await getProfile(id);

  if (!profile) {
    notFound();
  }

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            View {profile.full_name}
            {"'"}s logs
          </h2>
          <p className="text-muted-foreground">View user action logs</p>
        </div>
      </div>
      <UserActionsLog id={id} />
    </div>
  );
}
