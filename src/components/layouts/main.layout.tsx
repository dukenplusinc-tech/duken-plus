import type { FC, PropsWithChildren } from 'react';

import { AppProviders } from '@/lib/providers';
import { IonicLayout } from '@/components/layouts/ionic.layout';
import { LoadingOverlay } from '@/lib/primitives/loading/overlay';
import { NavigationListener } from '@/lib/primitives/loading/navigation-listener';

export const MainLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <AppProviders>
      <NavigationListener />
      <IonicLayout>{children}</IonicLayout>
      <LoadingOverlay />
    </AppProviders>
  );
};
