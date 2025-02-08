import type { FC, PropsWithChildren } from 'react';

import { AppProviders } from '@/lib/providers';
import { IonicLayout } from '@/components/layouts/ionic.layout';

export const MainLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <AppProviders>
      <IonicLayout>{children}</IonicLayout>
    </AppProviders>
  );
};
