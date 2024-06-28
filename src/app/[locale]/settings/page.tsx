import type { Metadata } from 'next';

import { GeneralShopSettings } from '@/lib/entities/shop/containers/general-shop-settings';

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Settings',
};

export default async function GeneralSettingsPage() {
  return (
    <div className="grid gap-6">
      <GeneralShopSettings />
    </div>
  );
}
