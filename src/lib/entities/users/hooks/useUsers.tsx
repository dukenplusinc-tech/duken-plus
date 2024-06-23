'use client';

import { useUser } from '@/lib/entities/users/hooks/useUser';
import { User, userSchema } from '@/lib/entities/users/schema';
import { useQuery } from '@/lib/supabase/query';

export const useUsers = () => {
  const user = useUser()!;

  return useQuery<User[]>(
    'profiles',
    `
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
    {
      schema: userSchema,
      filters: [
        {
          key: 'id',
          neq: user?.id,
        },
      ],
    }
  );
};
