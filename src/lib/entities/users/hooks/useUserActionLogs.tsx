'use client';

import { useMemo } from 'react';

import { UserActionLog } from '@/lib/entities/users/schema';
import { useInfiniteQuery } from '@/lib/supabase/useInfiniteQuery';

const allowedFilters: string[] = [];

export const useUserActionLogs = (id: string) => {
  const filters = useMemo(
    () => [
      {
        key: 'user_id',
        eq: id,
      },
    ],
    [id]
  );

  return useInfiniteQuery<UserActionLog>({
    table: 'user_action_logs',
    columns: `
        id,
        timestamp,
        action,
        entity,
        entity_id
      `,
    allowedFilters,
    filters,
  });
};
