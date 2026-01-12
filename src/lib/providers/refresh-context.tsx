'use client';

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  type FC,
  type PropsWithChildren,
} from 'react';

interface RefreshContextValue {
  registerRefresh: (refreshFn: () => Promise<void>) => void;
  unregisterRefresh: () => void;
  refresh: () => Promise<void>;
}

const RefreshContext = createContext<RefreshContextValue | undefined>(undefined);

export const RefreshProvider: FC<PropsWithChildren> = ({ children }) => {
  const refreshFnRef = useRef<(() => Promise<void>) | null>(null);

  const registerRefresh = useCallback((refreshFn: () => Promise<void>) => {
    refreshFnRef.current = refreshFn;
  }, []);

  const unregisterRefresh = useCallback(() => {
    refreshFnRef.current = null;
  }, []);

  const refresh = useCallback(async () => {
    if (refreshFnRef.current) {
      await refreshFnRef.current();
    }
  }, []);

  return (
    <RefreshContext.Provider
      value={{ registerRefresh, unregisterRefresh, refresh }}
    >
      {children}
    </RefreshContext.Provider>
  );
};

export const useRefreshContext = () => {
  const context = useContext(RefreshContext);
  if (!context) {
    throw new Error('useRefreshContext must be used within RefreshProvider');
  }
  return context;
};
