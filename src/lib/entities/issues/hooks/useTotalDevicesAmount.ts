'use client';

import { useMemo } from 'react';

import { useQuery } from '@/lib/supabase/query';

export const useTotalDevicesAmount = () => {
  const { count, isLoading, error } = useQuery(
    'devices',
    `
        id
      `
  );

  return useMemo(
    () => ({
      count,
      isLoading,
      error,
    }),
    [count, isLoading, error]
  );
};
