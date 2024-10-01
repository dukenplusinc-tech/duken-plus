import type { Metadata } from 'next';

import { PreferencesTabLayout } from '@/app/preferences/preferences-layout';

export const metadata: Metadata = {
  title: 'Preferences',
  description: 'Manage your preferences',
};

export default async function PreferenceTabPage() {
  return <PreferencesTabLayout />;
}
