'use client';

import { FC, PropsWithChildren, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

import type { PageBreadcrumbLink } from '@/components/page/breadcrumbs';

import { BreadcrumbsContext, BreadcrumbsContextState } from './context';

export const BreadcrumbsProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, setState] = useState<BreadcrumbsContextState>({
    links: [],
  });

  const pathname = usePathname();

  useEffect(() => {
    if (pathname) {
      const pieces = pathname.split('/').filter(Boolean);

      const links: PageBreadcrumbLink[] = pieces.map((path, idx) => {
        // Generate the full URL up to the current piece
        const href = `/${pieces.slice(0, idx + 1).join('/')}`;

        // Generate a user-friendly label if necessary
        let label = path;
        if (label === 'settings') label = 'Settings';
        if (label === 'users') label = 'Users';

        return {
          label,
          href,
        };
      });

      setState((prevState) => ({ ...prevState, links }));
    }
  }, [pathname]);

  return (
    <BreadcrumbsContext.Provider value={state}>
      {children}
    </BreadcrumbsContext.Provider>
  );
};
