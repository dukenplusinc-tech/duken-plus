import type { Metadata } from 'next';
import Link from 'next/link';

import { ChangePasswordCard } from '@/lib/entities/settings/containers/change-password';

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Settings',
};

export default async function GeneralSettingsPage() {
  return (
    <div className="grid gap-6">
      <ChangePasswordCard />
    </div>
  );
}
