'use client';

import { Employee } from '@/lib/entities/employees/schema';
import { useInfiniteQuery } from '@/lib/supabase/useInfiniteQuery';

export const useEmployees = () => {
  return useInfiniteQuery<Employee>({
    table: 'employees',
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
  });
};
