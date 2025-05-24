import type { ReactNode } from 'react';

import { redirectIfGuest } from '@/lib/auth/guard/auth/actions/validateUser';
import { MainLayout } from '@/components/layouts/main.layout';

export default async function SubscriptionLayout({
  children,
}: {
  children: ReactNode;
}) {
  await redirectIfGuest();

  return <MainLayout>{children}</MainLayout>;
}
