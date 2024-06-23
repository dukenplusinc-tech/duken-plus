import type { ReactNode } from 'react';

import { redirectIfGuest } from '@/lib/auth/guard/auth/actions/redirectIfGuest';
import { MainLayout } from '@/components/layouts/main.layout';
import { SettingsMenu } from '@/app/settings/settings-menu';

export default async function SettingsLayout({
  children,
}: {
  children: ReactNode;
}) {
  await redirectIfGuest();

  return (
    <MainLayout>
      <div className="h-full flex-1 flex-col space-y-8 p-8 flex">
        <div className="mx-auto grid w-full max-w-6xl gap-2 mb-10">
          <h1 className="text-3xl font-semibold">Settings</h1>
        </div>
        <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
          <SettingsMenu />
          {children}
        </div>
      </div>
    </MainLayout>
  );
}
