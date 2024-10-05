import type { FC, PropsWithChildren } from 'react';

import { FiltersProvider } from '@/lib/composite/filters/provider';
import { DialogProvider } from '@/lib/primitives/dialog/provider';
import { DialogModalProvider } from '@/lib/primitives/modal/provider';
import { TooltipProvider } from '@/components/ui/tooltip';

export const AppProviders: FC<PropsWithChildren> = ({ children }) => {
  return (
    <TooltipProvider>
      <FiltersProvider>
        <DialogProvider>
          <DialogModalProvider>{children}</DialogModalProvider>
        </DialogProvider>
      </FiltersProvider>
    </TooltipProvider>
  );
};
