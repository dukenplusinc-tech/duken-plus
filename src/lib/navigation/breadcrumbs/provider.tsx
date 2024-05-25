"use client";

import {FC, useState, PropsWithChildren, useEffect} from "react";
import {usePathname} from 'next/navigation'

import {BreadcrumbsContextState, BreadcrumbsContext} from "./context";
import type {PageBreadcrumbLink} from "@/components/page/breadcrumbs";

export const BreadcrumbsProvider: FC<PropsWithChildren> = ({children}) => {
  const [state, setState] = useState<BreadcrumbsContextState>({
    links: []
  });

  const pathname = usePathname()

  useEffect(() => {
    if (pathname) {
      const pieces = pathname.split('/').filter(Boolean).slice(0, 2)

      const links: PageBreadcrumbLink[] = pieces.map((path, idx) => {
        const href = idx === 1 ? '' : `/${path}`;

        return {
          label: path,
          href,
        }
      })

      setState(prevState => ({...prevState, links}))
    }
  }, [pathname]);

  return <BreadcrumbsContext.Provider value={state}>{children}</BreadcrumbsContext.Provider>
}