import { useQuery } from '@supabase-cache-helpers/postgrest-swr';

import { useUser } from '@/lib/entities/users/hooks/useUser';
import type { User } from '@/lib/entities/users/schema';
import { createClient } from '@/lib/supabase/client';

type UserRole = User['role'];

export const useUserRole = (): UserRole | null => {
  const user = useUser()!;

  const supabase = createClient();

  const promise = supabase
    .from('profiles')
    .select(
      `
      role:role_id (
        id,
        name:role,
        scope
      )
  `
    )
    .eq('id', user?.id)
    .single();

  const { data } = useQuery(user?.id ? promise : null);

  return (data?.role as never as UserRole) || null;
};
