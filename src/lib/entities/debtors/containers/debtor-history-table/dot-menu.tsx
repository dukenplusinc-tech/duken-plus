import { useMemo } from 'react';
import { useTranslations } from 'next-intl';

import { useTransactionForm } from '@/lib/entities/debtors/containers/transaction-form';
import { useDeleteDebtorTransaction } from '@/lib/entities/debtors/hooks/useDeleteDebtorTransaction';
import type { DebtorTransaction } from '@/lib/entities/debtors/schema';
import { useEmployeeMode } from '@/lib/entities/employees/context';
import type { DropDownButtonOption } from '@/components/ui/ionic/dropdown';

export function useDebtorTransactionDotMenu(
  transaction: DebtorTransaction
): DropDownButtonOption[] {
  const t = useTranslations();
  const handleEdit = useTransactionForm({ id: transaction.id });

  const handleRemove = useDeleteDebtorTransaction(transaction.id);

  const { isEmployee } = useEmployeeMode();

  return useMemo(
    () =>
      [
        {
          label: t('datatable.actions.edit_caption'),
          onClick: handleEdit,
        },
        !isEmployee && {
          label: t('datatable.actions.delete_cation'),
          onClick: handleRemove.onDelete,
          disabled: handleRemove.processing,
        },
      ].filter(Boolean) as DropDownButtonOption[],
    [t, handleEdit, isEmployee, handleRemove.onDelete, handleRemove.processing]
  );
}
