import { useRouter } from 'next/navigation';

import { removeNotes } from '@/lib/entities/notes/actions/removeNotes';
import { useNotes } from '@/lib/entities/notes/hooks/useNotes';
import { useConfirmDelete } from '@/lib/primitives/dialog/confirm/delete';

export function useDeleteNotes(id?: string, nextRoute?: string) {
  const route = useRouter();
  const { refresh } = useNotes();

  return useConfirmDelete({
    onConfirm: async (ids?: string[]) => {
      const target = id || ids;

      await removeNotes(target!);

      await refresh();

      if (nextRoute) {
        route.push(nextRoute);
      }
    },
  });
}
