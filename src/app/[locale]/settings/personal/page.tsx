import type { Metadata } from 'next';

import { PersonalSettings } from '@/lib/entities/settings/containers/personal-settings';

export const metadata: Metadata = {
  title: 'Personal Settings',
  description: 'Personal Settings',
};

export default async function PersonalSettingsPage() {
  return (
    <div className="grid gap-6">
      <PersonalSettings />
    </div>
  );
}
