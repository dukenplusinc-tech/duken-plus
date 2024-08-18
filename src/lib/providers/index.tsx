import type { FC, PropsWithChildren } from 'react';

import { FiltersProvider } from '@/lib/composite/filters/provider';
import { BreadcrumbsProvider } from '@/lib/navigation/breadcrumbs/provider';
import { DialogProvider } from '@/lib/primitives/dialog/provider';
import { DialogModalProvider } from '@/lib/primitives/modal/provider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { IonicProvider } from '@/components/ionic/provider';

export const AppProviders: FC<PropsWithChildren> = ({ children }) => {
  return (
    <IonicProvider>
      <TooltipProvider>
        <FiltersProvider>
          <DialogProvider>
            <DialogModalProvider>
              <BreadcrumbsProvider>{children}</BreadcrumbsProvider>
            </DialogModalProvider>
          </DialogProvider>
        </FiltersProvider>
      </TooltipProvider>
    </IonicProvider>
  );
};
