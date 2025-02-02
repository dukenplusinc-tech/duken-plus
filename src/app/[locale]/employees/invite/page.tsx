import type { Metadata } from 'next';

import { InviteUser } from '@/lib/entities/users/containers/create-user';

export const metadata: Metadata = {
  title: 'Invite new User',
  description: 'Manage users',
};

export default async function InvitePage() {
  return <InviteUser />;
}
