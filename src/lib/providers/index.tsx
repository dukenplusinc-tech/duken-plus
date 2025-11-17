'use client';

import type { FC, PropsWithChildren } from 'react';

import { FiltersProvider } from '@/lib/composite/filters/provider';
import { ImageViewerProvider } from '@/lib/composite/image/viewer';
import { UploadManagerProvider } from '@/lib/composite/uploads/manager';
import { EmployeeModeProvider } from '@/lib/entities/employees/context';
import { DialogProvider } from '@/lib/primitives/dialog/provider';
import { DialogModalProvider } from '@/lib/primitives/modal/provider';
import { LoadingProvider } from '@/lib/primitives/loading/context';
import { TooltipProvider } from '@/components/ui/tooltip';

export const AppProviders: FC<PropsWithChildren> = ({ children }) => {
  return (
    <LoadingProvider>
      <EmployeeModeProvider>
        <ImageViewerProvider>
          <TooltipProvider>
            <UploadManagerProvider>
              <FiltersProvider>
                <DialogProvider>
                  <DialogModalProvider>{children}</DialogModalProvider>
                </DialogProvider>
              </FiltersProvider>
            </UploadManagerProvider>
          </TooltipProvider>
        </ImageViewerProvider>
      </EmployeeModeProvider>
    </LoadingProvider>
  );
};
