'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useOffsetInfiniteScrollQuery } from '@supabase-cache-helpers/postgrest-swr';

import { ActiveFilter, useFiltersCtx } from '@/lib/composite/filters/context';
import { createClient } from '@/lib/supabase/client';
import { withFilters } from '@/lib/supabase/filters';
import { withSorting } from '@/lib/supabase/sorting';

interface InfiniteQueryOptions {
  table: string;
  columns: string;
  allowedFilters?: string[];
  limit?: number;
  filters?: ActiveFilter[];
}

export function useInfiniteQuery<T>({
  table,
  columns,
  allowedFilters,
  limit = 20, // Default page size
  filters: defaultFilters,
}: InfiniteQueryOptions) {
  const client = createClient();

  // Consume filter context
  const { applied: appliedFilters, sorting } = useFiltersCtx();

  const filters = useMemo(() => {
    const computed = allowedFilters
      ? appliedFilters.filter(({ key }) => allowedFilters.includes(key))
      : appliedFilters;

    if (defaultFilters) {
      return [...defaultFilters, ...computed];
    }

    return computed;
  }, [allowedFilters, appliedFilters, defaultFilters]);

  // Supabase query builder
  const query = useMemo(() => {
    let baseQuery = client
      .from(table as never)
      .select(columns, { count: 'exact' });

    baseQuery = withFilters(baseQuery, filters);
    baseQuery = withSorting(baseQuery, sorting);

    return baseQuery;
  }, [client, table, columns, filters, sorting]);

  // Use the `useOffsetInfiniteScrollQuery` hook for infinite scrolling
  const { data, error, loadMore, isLoading, isValidating, mutate } =
    useOffsetInfiniteScrollQuery(query as any, {
      pageSize: limit,
    });

  const refresh = useCallback(async () => {
    await mutate();
  }, [mutate]);

  // Attach IntersectionObserver for scroll-to-end functionality
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!sentinelRef.current || isLoading || isValidating) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && loadMore) {
          loadMore();
        }
      },
      {
        root: null, // Defaults to the viewport
        rootMargin: '200px', // Preload data before fully reaching the end
        threshold: 0.1, // Trigger when 10% of the sentinel is visible
      }
    );

    observer.observe(sentinelRef.current);

    return () => observer.disconnect();
  }, [loadMore, isLoading, isValidating]);

  // Debugging helper
  if (typeof window === 'object') {
    (window as any).infinity = { loadMore, refresh };
  }

  return {
    data: (data?.flat() || []) as T[], // Flatten pages into a single array
    error,
    isLoading,
    isValidating,
    fetchMore: loadMore,
    refresh,
    sentinelRef, // Expose the sentinelRef for attaching to the DOM
  };
}
