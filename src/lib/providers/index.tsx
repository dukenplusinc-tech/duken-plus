import type {FC, PropsWithChildren} from "react";

import {TooltipProvider} from "@/components/ui/tooltip";
import {FiltersProvider} from "@/lib/composite/filters/provider";
import {DialogProvider} from "@/lib/primitives/dialog/provider";
import {BreadcrumbsProvider} from "@/lib/navigation/breadcrumbs/provider";

export const AppProviders: FC<PropsWithChildren> = ({children}) => {
  return (
    <TooltipProvider>
      <FiltersProvider>
        <DialogProvider>
          <BreadcrumbsProvider>
            {children}
          </BreadcrumbsProvider>
        </DialogProvider>
      </FiltersProvider>
    </TooltipProvider>
  );
}
