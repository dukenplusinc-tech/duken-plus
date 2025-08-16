import { useCallback } from 'react';

import { useContractorList } from '@/lib/entities/contractors/hooks/useContractorList';
import { useTodayDeliveries } from '@/lib/entities/deliveries/hooks/useTodayDeliveries';
import { useExpenseTypes } from '@/lib/entities/expenses/hooks/useExpenseTypes';
import { useTotalExpenses } from '@/lib/entities/expenses/hooks/useTotalExpenses';

export const useRefreshHomeData = () => {
  const { refresh: deliveriesRefresh } = useTodayDeliveries();
  const { refresh: totalExpRefresh } = useTotalExpenses();
  const { refresh: expensesTypesRefresh } = useExpenseTypes();
  const { refresh: contractorListRefresh } = useContractorList();

  return useCallback(() => {
    return Promise.all([
      deliveriesRefresh(),
      totalExpRefresh(),
      expensesTypesRefresh(),
      contractorListRefresh(),
    ]);
  }, [
    deliveriesRefresh,
    totalExpRefresh,
    expensesTypesRefresh,
    contractorListRefresh,
  ]);
};
