import type { ReactNode } from 'react';

import { validateUser } from '@/lib/auth/guard/auth/actions/validateUser';
import { MainLayout } from '@/components/layouts/main.layout';

export default async function SettingsLayout({
  children,
}: {
  children: ReactNode;
}) {
  await validateUser();

  return <MainLayout>{children}</MainLayout>;
}
