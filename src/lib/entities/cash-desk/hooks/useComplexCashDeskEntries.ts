import { useCallback } from 'react';

import { useCashDeskEntries } from '@/lib/entities/cash-desk/hooks/useCashDeskEntries';

export const useComplexCashDeskEntries = () => {
  const {
    data: all,
    isLoading: loadingAll,
    sentinelRef: sentinelAll,
    refresh: refreshAll,
  } = useCashDeskEntries();
  const {
    data: cash,
    isLoading: loadingCash,
    sentinelRef: sentinelCash,
    refresh: refreshCash,
  } = useCashDeskEntries('cash');
  const {
    data: bank,
    isLoading: loadingBank,
    sentinelRef: sentinelBank,
    refresh: refreshBank,
  } = useCashDeskEntries('bank_transfer');

  const refreshComplex = useCallback(async () => {
    await Promise.all([refreshAll(), refreshCash(), refreshBank()]);
  }, [refreshAll, refreshBank, refreshCash]);

  return {
    // all
    all,
    loadingAll,
    sentinelAll,

    // cash
    cash,
    loadingCash,
    sentinelCash,

    // bank transfers
    bank,
    loadingBank,
    sentinelBank,

    // common
    refresh: refreshComplex,
  };
};
