'use client';

import {
  UserActionLog,
  userActionLogSchema,
} from '@/lib/entities/users/schema';
import { useQuery } from '@/lib/supabase/query';

export const useUserActionLogs = (id: string) => {
  return useQuery<UserActionLog[]>(
    'user_action_logs',
    `
        id,
        timestamp,
        action,
        entity,
        entity_id
      `,
    {
      allowedFilters: [],
      filters: [
        {
          key: 'user_id',
          eq: id,
        },
      ],
      sort: [
        {
          id: 'timestamp',
          desc: true,
        },
      ],
      schema: userActionLogSchema,
    }
  );
};
