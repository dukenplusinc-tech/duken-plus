import { useState, useCallback } from 'react';

import { CashRegisterType } from '@/lib/entities/cash-desk/schema';
import { useCurrentShift } from '@/lib/entities/cash-desk/hooks/useCurrentShift';
import { useCashDeskStat } from '@/lib/entities/cash-desk/hooks/useCashDeskStat';

export function useAddTransferModal() {
  const [open, setOpen] = useState(false);
  const { refresh: refreshShift } = useCurrentShift();
  const { refresh: refreshStats } = useCashDeskStat();

  const openModal = useCallback(() => {
    setOpen(true);
  }, []);

  const closeModal = useCallback((open?: boolean) => {
    setOpen(open ?? false);
  }, []);

  const handleSuccess = useCallback(async () => {
    // Refresh shift data first to ensure currentShift is up to date
    await refreshShift();
    // Small delay to ensure shift data is propagated, then refresh stats
    // This ensures the shift dashboard view has the latest data
    setTimeout(async () => {
      await refreshStats();
    }, 300);
  }, [refreshShift, refreshStats]);

  return {
    open,
    openModal,
    closeModal,
    handleSuccess,
    type: CashRegisterType.BANK_TRANSFER,
  };
}

