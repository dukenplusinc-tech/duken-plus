'use client';

import { useMemo } from 'react';

import { useUser } from '@/lib/entities/users/hooks/useUser';
import { User } from '@/lib/entities/users/schema';
import { useInfiniteQuery } from '@/lib/supabase/useInfiniteQuery';

export const useUsers = () => {
  const user = useUser()!;

  const filters = useMemo(
    () => [
      {
        key: 'id',
        neq: user?.id,
      },
    ],
    [user?.id]
  );

  return useInfiniteQuery<User>({
    table: 'profiles',
    columns: `
        id,
        full_name,
        avatar_url,
        role:role_id (
          id,
          name:role,
          scope
        ),
        created_at,
        updated_at
      `,
    filters,
  });
};
