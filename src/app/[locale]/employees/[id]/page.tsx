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

  return <UserActionsLog id={id} full_name={profile.full_name!} />;
}
