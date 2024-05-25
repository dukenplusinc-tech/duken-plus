import {createContext, useContext} from "react";
import {PageBreadcrumbLink} from "@/components/page/breadcrumbs";

export interface BreadcrumbsContextState {
  links: PageBreadcrumbLink[]
}

export const BreadcrumbsContext = createContext<BreadcrumbsContextState>({
  links: []
});

export const useBreadcrumbsCtx = () => {
  return useContext(BreadcrumbsContext);
}

export const useBreadcrumbsLinks = () => {
  const { links } = useBreadcrumbsCtx()

  return links;
}
