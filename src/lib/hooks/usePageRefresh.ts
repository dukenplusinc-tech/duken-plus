import { useEffect } from 'react';

import { useRefreshContext } from '@/lib/providers/refresh-context';

/**
 * Hook to register a refresh function for pull-to-refresh functionality.
 * The function will be automatically unregistered when the component unmounts.
 *
 * @param refreshFn - Function that will be called when user pulls to refresh
 */
export const usePageRefresh = (refreshFn: () => Promise<void>) => {
  const { registerRefresh, unregisterRefresh } = useRefreshContext();

  useEffect(() => {
    registerRefresh(refreshFn);

    return () => {
      unregisterRefresh();
    };
  }, [refreshFn, registerRefresh, unregisterRefresh]);
};
