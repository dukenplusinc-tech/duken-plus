import type { Metadata } from 'next';

import { SecuritySettings } from '@/lib/entities/settings/containers/security-settings';

export const metadata: Metadata = {
  title: 'Security Settings',
  description: 'Security Settings',
};

export default async function SecuritySettingsPage() {
  return (
    <div className="grid gap-6">
      <SecuritySettings />
    </div>
  );
}
