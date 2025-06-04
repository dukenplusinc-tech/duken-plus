import { useQuery } from '@supabase-cache-helpers/postgrest-swr';

import { useEmployeeMode } from '@/lib/entities/employees/context';
import { RoleScope } from '@/lib/entities/roles/types';
import { useUser } from '@/lib/entities/users/hooks/useUser';
import type { User } from '@/lib/entities/users/schema';
import type { Role } from '@/lib/entities/roles/schema';
import { createClient } from '@/lib/supabase/client';

type UserRole = User['role'];

interface QueryResult {
  role: Role;
}

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

  const { data } = useQuery<QueryResult>(
    user?.id ? (promise as any) : null
  );
  const employeeMode = useEmployeeMode();

  if (employeeMode.isEmployee) {
    return {
      id: 0,
      name: 'Cashier',
      scope: [RoleScope.cashDesk, RoleScope.debtor],
    } as UserRole;
  }

  return (data?.role as never as UserRole) || null;
};
