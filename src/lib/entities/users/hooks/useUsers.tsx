'use client';

import { User, userSchema } from '@/lib/entities/users/schema';
import { useQuery } from '@/lib/supabase/query';

export const useUsers = () => {
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
    }
  );
};
