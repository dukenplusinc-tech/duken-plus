import { useMemo } from 'react';
import { useTranslations } from 'next-intl';

import { useDeleteDebtorTransaction } from '@/lib/entities/debtors/hooks/useDeleteDebtorTransaction';
import type { DebtorTransaction } from '@/lib/entities/debtors/schema';
import { useEmployeeMode } from '@/lib/entities/employees/context';
import type { DropDownButtonOption } from '@/components/ui/ionic/dropdown';

export function useDebtorTransactionDotMenu(
  transaction: DebtorTransaction
): DropDownButtonOption[] {
  const t = useTranslations();

  const handleRemove = useDeleteDebtorTransaction(transaction.id);

  const { isEmployee } = useEmployeeMode();

  return useMemo(
    () =>
      [
        !isEmployee && {
          label: t('datatable.actions.delete_cation'),
          onClick: handleRemove.onDelete,
          disabled: handleRemove.processing,
        },
      ].filter(Boolean) as DropDownButtonOption[],
    [t, isEmployee, handleRemove.onDelete, handleRemove.processing]
  );
}
