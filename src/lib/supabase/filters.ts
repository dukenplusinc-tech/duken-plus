import type { ActiveFilter } from '@/lib/composite/filters/context';
import type { Builder } from '@/lib/supabase/client';

export function withFilters<T extends Builder>(
  query: T,
  filters: ActiveFilter[] | undefined | null
) {
  let builder = query;

  if (filters) {
    filters.forEach(({ key, ...apply }) => {
      if (apply?.gte) {
        builder = builder.gte(key, apply.gte);
      } else if (apply?.lte) {
        builder = builder.lte(key, apply.lte);
      } else if (apply?.in?.length) {
        builder = builder.in(key, apply.in);
      } else if (apply?.eq) {
        builder = builder.eq(key, apply.eq);
      } else if (apply?.neq) {
        builder = builder.neq(key, apply.neq);
      } else if (apply?.like) {
        builder = builder.like(key, apply.like);
      } else if (apply?.search) {
        let query = apply.search;

        // break down by spaces
        if (query.includes(' ') && !query.includes("'")) {
          query = query
            .split(' ')
            .map((value) => `'${value}'`)
            .join(' & ');
        }

        builder = builder.textSearch(key, query);
      }
    });
  }

  return builder;
}
