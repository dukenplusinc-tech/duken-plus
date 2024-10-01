import type { Metadata } from 'next';

import { PreferencesTabLayout } from '@/app/settings/preferences-layout';

export const metadata: Metadata = {
  title: 'Preferences',
  description: 'Manage your preferences',
};

export default async function PreferenceTabPage() {
  return <PreferencesTabLayout />;
}
