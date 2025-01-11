import { useRouter } from 'next/navigation';

import { removeDebtors } from '@/lib/entities/debtors/actions/removeDebtors';
import {
  useBlackListedDebtors,
  useDebtors,
} from '@/lib/entities/debtors/hooks/useDebtors';
import { useConfirmDelete } from '@/lib/primitives/dialog/confirm/delete';

export function useDeleteDebtors(id?: string, nextRoute?: string) {
  const route = useRouter();

  const { refresh } = useDebtors();
  const { refresh: refreshBlackListed } = useBlackListedDebtors();

  return useConfirmDelete({
    onConfirm: async (ids?: string[]) => {
      const target = id || ids;

      await removeDebtors(target!);

      await Promise.all([refresh(), refreshBlackListed()]);

      if (nextRoute) {
        route.push(nextRoute);
      }
    },
  });
}
