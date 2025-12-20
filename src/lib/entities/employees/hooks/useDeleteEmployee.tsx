import { removeEmployees } from '@/lib/entities/employees/actions/remove';
import { useEmployees } from '@/lib/entities/employees/hooks/useEmployees';
import { useConfirmDelete } from '@/lib/primitives/dialog/confirm/delete';

export function useDeleteEmployee(id?: string) {
  const { refresh } = useEmployees();

  return useConfirmDelete({
    onConfirm: async (ids?: string[]) => {
      const target = id || ids;

      await removeEmployees(target!);

      await refresh();
    },
  });
}




