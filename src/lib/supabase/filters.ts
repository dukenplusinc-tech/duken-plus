import type { PostgrestFilterBuilder } from '@supabase/postgrest-js';

import type { ActiveFilter } from '@/lib/composite/filters/context';

function escapeLike(raw: string) {
  return raw.replace(/[%_]/g, (m) => '\\' + m);
}

/**
 * Full-typed phrase match (FTS) OR case-insensitive substring (ILIKE).
 * - Uses PostgREST operators directly: phfts (phrase FTS) + ilike
 * - Works great for names, titles, etc.
 */
export function applySmartNameSearch<T extends any>(
  // @ts-ignore
  builder: PostgrestFilterBuilder<T, any, any>,
  column: string, // e.g. "name"
  queryRaw: string
) {
  const q = (queryRaw ?? '').trim();
  if (!q) return builder;

  // substring pattern
  const like = `%${escapeLike(q)}%`;

  // Build a single OR group so PostgREST doesn’t AND the filters
  // We use raw .filter() because .textSearch() can’t be placed inside a single .or() group together with ilike.
  const orParts = [
    `${column}.ilike.${like}`,
    `${column}.phfts.${q}`, // phrase full-text search for “full typed name”
  ];

  // If you also want more forgiving behavior (typos / OR words),
  // add websearch FTS as a third arm:
  // orParts.push(`${column}.wfts.${q}`);

  return builder.or(orParts.join(','));
}

export function withFilters(
  query: any,
  filters: ActiveFilter[] | undefined | null
) {
  let builder = query as any;

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
        builder = applySmartNameSearch(builder, key, apply.search);
      }
    });
  }

  return builder;
}
