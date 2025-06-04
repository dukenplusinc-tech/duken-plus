'use client';

import { useMemo } from 'react';
import { useQuery as useQuerySwr } from '@supabase-cache-helpers/postgrest-swr';
import * as z from 'zod';

import { ActiveFilter, SortingState } from '@/lib/composite/filters/context';
import { createClient } from '@/lib/supabase/client';
import { withFilters } from '@/lib/supabase/filters';
import { withSorting } from '@/lib/supabase/sorting';

interface Options {
  schema?: z.ZodObject<any>;
  filters?: ActiveFilter[];
  sort?: SortingState | undefined;
}

export function useQueryById<T extends unknown>(
  id: string | null,
  table: string,
  columns: string,
  { schema, filters = [], sort = undefined }: Options = {}
) {
  const client = createClient();

  const buildPromise = () => {
    const promise = client
      .from(table as never)
      .select(columns, { count: 'exact' })
      .eq('id', id!)
      .single();

    return withSorting(withFilters(promise as never, filters), sort);
  };

  const { count, isLoading, data, error, mutate, isValidating } = useQuerySwr(
    id ? (buildPromise() as any) : null
  );

  return useMemo(() => {
    const result = schema && data ? schema.parse(data) : data;

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

export type QueryByIdResult<T> = ReturnType<typeof useQueryById<T>>;
