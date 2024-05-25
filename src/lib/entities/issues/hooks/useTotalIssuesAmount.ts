'use client';

import { useMemo } from 'react';

import { Issue } from '@/lib/entities/issues/schema';
import { useQuery } from '@/lib/supabase/query';

export const useTotalIssuesAmount = () => {
  const { count, isLoading, error } = useQuery<Issue[]>(
    'issues',
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
