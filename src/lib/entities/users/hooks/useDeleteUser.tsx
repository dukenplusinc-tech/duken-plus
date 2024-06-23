import { removeUsers } from '@/lib/entities/users/actions/removeUsers';
import { useUsers } from '@/lib/entities/users/hooks/useUsers';
import { useConfirmDelete } from '@/lib/primitives/dialog/confirm/delete';

export function useDeleteUser(id?: string) {
  const { refresh } = useUsers();

  return useConfirmDelete({
    onConfirm: async (ids?: string[]) => {
      const target = id || ids;

      await removeUsers(target!);

      await refresh();
    },
  });
}
