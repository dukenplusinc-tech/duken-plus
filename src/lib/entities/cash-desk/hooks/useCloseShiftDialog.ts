import { useState, useCallback } from 'react';

import { useCurrentShift } from '@/lib/entities/cash-desk/hooks/useCurrentShift';
import { useShiftHistory } from '@/lib/entities/cash-desk/hooks/useShiftHistory';

export function useCloseShiftDialog() {
  const [open, setOpen] = useState(false);
  const { data: currentShift, refresh: refreshShift } = useCurrentShift();
  const { refresh: refreshHistory } = useShiftHistory(1, 30);

  const openDialog = useCallback(() => {
    if (currentShift && currentShift.status === 'open') {
      setOpen(true);
    }
  }, [currentShift]);

  const closeDialog = useCallback((open?: boolean) => {
    setOpen(open ?? false);
  }, []);

  const handleSuccess = useCallback(() => {
    refreshShift();
    refreshHistory();
    setOpen(false);
  }, [refreshShift, refreshHistory]);

  return {
    open,
    openDialog,
    closeDialog,
    handleSuccess,
    shiftId: currentShift?.id || currentShift?.shift_id || '',
    isShiftOpen: currentShift && currentShift.status === 'open',
  };
}

