import type { Metadata } from 'next';

import { CreateEmployee } from '@/lib/entities/employees/containers/create-employee';

export const metadata: Metadata = {
  title: 'Invite new employee',
  description: 'Manage data',
};

export default async function InvitePage() {
  return <CreateEmployee />;
}
