'use client';

import { useMemo } from 'react';
import { useQuery as useQuerySwr } from '@supabase-cache-helpers/postgrest-swr';
import * as z from 'zod';

import {
  ActiveFilter,
  SortingState,
  useFiltersCtx,
} from '@/lib/composite/filters/context';
import { createClient } from '@/lib/supabase/client';
import { withFilters } from '@/lib/supabase/filters';
import { withSorting } from '@/lib/supabase/sorting';

interface Options {
  schema?: z.ZodObject<any>;
  allowedFilters?: string[];
  filters?: ActiveFilter[];
  sort?: SortingState | undefined;
  limit?: number | undefined;
}

export function useQuery<T extends Array<unknown>>(
  table: string,
  columns: string,
  {
    schema,
    allowedFilters,
    filters: customFilters = [],
    sort: customSort = undefined,
    limit = undefined,
  }: Options = {}
) {
  // Supabase client
  const client = createClient();

  // Consume filter context
  const { applied, sorting } = useFiltersCtx();

  // Merge filters from context and custom filters
  const filters = useMemo(() => {
    const contextFilters = allowedFilters
      ? applied.filter(({ key }) => allowedFilters.includes(key))
      : applied;

    return [...contextFilters, ...customFilters];
  }, [applied, allowedFilters, customFilters]);

  // Build the Supabase query
  const query = useMemo(() => {
    let baseQuery = client
      .from(table as never)
      .select(columns, { count: 'exact' });

    // Apply filters
    baseQuery = withFilters(baseQuery, filters);

    // Apply sorting
    baseQuery = withSorting(baseQuery, customSort || sorting);

    if (limit) {
      baseQuery = baseQuery.limit(limit);
    }

    return baseQuery;
  }, [client, table, columns, filters, customSort, sorting, limit]);

  // Use SWR to fetch the data
  const { data, error, count, mutate, isValidating } = useQuerySwr(query as any);

  // Validate data with schema, if provided
  const result = useMemo(() => {
    return schema ? z.array(schema).parse(data || []) : data;
  }, [data, schema]);

  return useMemo(() => {
    return {
      data: result as T,
      error,
      count,
      isLoading: !error && !data,
      isValidating,
      mutate,
      refresh: () => mutate(),
    };
  }, [result, error, count, data, isValidating, mutate]);
}
