import { useRouter } from 'next/navigation';

import { removeDebtorTransactions } from '@/lib/entities/debtors/actions/removeDebtorTransactions';
import { useDebtorTransactions } from '@/lib/entities/debtors/hooks/useDebtorTransactions';
import { useConfirmDelete } from '@/lib/primitives/dialog/confirm/delete';

export function useDeleteDebtorTransaction(id?: string, nextRoute?: string) {
  const route = useRouter();

  const { refresh } = useDebtorTransactions();

  return useConfirmDelete({
    onConfirm: async (ids?: string[]) => {
      const target = id || ids;

      await removeDebtorTransactions(target!);

      await Promise.all([refresh()]);

      if (nextRoute) {
        route.push(nextRoute);
      }
    },
  });
}
