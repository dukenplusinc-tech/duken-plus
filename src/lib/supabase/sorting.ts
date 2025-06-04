import type { SortingState } from '@/lib/composite/filters/context';
export function withSorting(
  query: any,
  sorting: SortingState | undefined | null
) {
  let builder = query as any;

  if (sorting?.length) {
    builder = builder.order(sorting[0].id, { ascending: !sorting[0].desc });
  }

  return builder;
}
