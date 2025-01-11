import { useRouter } from 'next/navigation';

import { removeContractors } from '@/lib/entities/contractors/actions/removeContractors';
import { useContractors } from '@/lib/entities/contractors/hooks/useContractors';
import { useConfirmDelete } from '@/lib/primitives/dialog/confirm/delete';

export function useDeleteContractors(id?: string, nextRoute?: string) {
  const route = useRouter();

  const { refresh } = useContractors();

  return useConfirmDelete({
    onConfirm: async (ids?: string[]) => {
      const target = id || ids;

      await removeContractors(target!);

      await refresh();

      if (nextRoute) {
        route.push(nextRoute);
      }
    },
  });
}
