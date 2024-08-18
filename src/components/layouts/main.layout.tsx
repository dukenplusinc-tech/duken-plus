import type { FC, PropsWithChildren } from 'react';

import { AppProviders } from '@/lib/providers';
import { IonicLayout } from '@/components/layouts/ionic.layout';
import { AsideNav } from '@/components/navigation/aside';
import { HeaderNav } from '@/components/navigation/header';

export const MainLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <IonicLayout>
      <AppProviders>
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
          <AsideNav />
          <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
            <HeaderNav />
            <main>{children}</main>
          </div>
        </div>
      </AppProviders>
    </IonicLayout>
  );
};
