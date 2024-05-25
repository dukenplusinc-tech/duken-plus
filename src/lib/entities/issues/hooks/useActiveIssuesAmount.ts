'use client';

import { useMemo, useRef } from 'react';
import { useQuery } from '@supabase-cache-helpers/postgrest-swr';
import { subHours } from 'date-fns';

import { createClient } from '@/lib/supabase/client';

function getQueryBuilder() {
  const client = createClient();

  const now = new Date();
  const oneHourAgo = subHours(now, 1);

  return client
    .from('issues')
    .select('id', { count: 'exact' })
    .filter('created_at', 'gte', oneHourAgo.toISOString())
    .filter('created_at', 'lt', now.toISOString());
}

export const useActiveIssuesAmount = () => {
  const query = useRef(getQueryBuilder());

  const { count, isLoading, error } = useQuery(query.current);

  return useMemo(
    () => ({
      count,
      isLoading,
      error,
    }),
    [count, isLoading, error]
  );
};
