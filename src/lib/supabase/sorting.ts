import type { SortingState } from '@/lib/composite/filters/context';
import type { Builder } from '@/lib/supabase/client';

export function withSorting<T extends Builder>(
  query: T,
  sorting: SortingState | undefined | null
) {
  let builder = query;

  if (sorting?.length) {
    builder = builder.order(sorting[0].id, { ascending: !sorting[0].desc });
  }

  return builder;
}
