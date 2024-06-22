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
import { withRange } from '@/lib/supabase/pagination';
import { withSorting } from '@/lib/supabase/sorting';

interface Options {
  schema?: z.ZodObject<any>;
  allowedFilters?: string[];
  pagination?: boolean;
  filters?: ActiveFilter[];
  sort?: SortingState | undefined;
}

export function useQuery<T extends Array<unknown>>(
  table: string,
  columns: string,
  {
    schema,
    allowedFilters,
    pagination: canPagination = true,
    filters: customFilters = [],
    sort: customSort = undefined,
  }: Options = {}
) {
  const client = createClient();

  const { applied, pagination, sorting } = useFiltersCtx();

  const filters = useMemo(() => {
    if (allowedFilters) {
      return applied.filter(({ key }) => allowedFilters.includes(key));
    }

    return applied;
  }, [applied, allowedFilters]);

  const promise = client
    .from(table as never)
    .select(columns, { count: 'exact' });

  const { count, isLoading, data, error, mutate, isValidating } = useQuerySwr(
    withRange(
      withSorting(
        withFilters(promise, [...filters, ...customFilters]),
        customSort || sorting
      ),
      canPagination && pagination
    )
  );

  return useMemo(() => {
    const result = schema ? z.array(schema).parse(data || []) : data;

    return {
      count,
      isLoading,
      data: result as T,
      error,
      mutate,
      refresh: () => mutate(),
      isValidating,
    };
  }, [count, data, error, isLoading, isValidating, mutate, schema]);
}
