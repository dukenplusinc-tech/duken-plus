import { useEmployeeMode } from '@/lib/entities/employees/context';
import { useProfile } from '@/lib/entities/users/hooks/useUser';

export function useAddedBy() {
  const employeeMode = useEmployeeMode();
  const { data: user } = useProfile();

  return employeeMode?.session?.full_name || user?.full_name || null;
}
