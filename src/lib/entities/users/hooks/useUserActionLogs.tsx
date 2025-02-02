'use client';

import { useMemo } from 'react';

import type { ActiveFilter } from '@/lib/composite/filters/context';
import type { UserActionLog } from '@/lib/entities/users/schema';
import { useInfiniteQuery } from '@/lib/supabase/useInfiniteQuery';

const allowedFilters: string[] = [];

export const useUserActionLogs = ({
  user_id,
  employee_id,
}: {
  user_id?: string;
  employee_id?: string;
}) => {
  const filters = useMemo(
    () =>
      [
        user_id && {
          key: 'user_id',
          eq: user_id,
        },
        employee_id && {
          key: 'employee_id',
          eq: employee_id,
        },
      ].filter(Boolean) as ActiveFilter[],
    [employee_id, user_id]
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
