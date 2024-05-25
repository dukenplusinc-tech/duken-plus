import type { Pagination } from '@/lib/composite/filters/context';
import type { Builder } from '@/lib/supabase/client';

export function withRange<T extends Builder>(
  query: T,
  pagination: Pagination | boolean
) {
  if (typeof pagination === 'boolean') {
    return query;
  }

  return query.range(
    pagination.pageIndex * pagination.pageSize,
    (pagination.pageIndex + 1) * pagination.pageSize - 1
  );
}
