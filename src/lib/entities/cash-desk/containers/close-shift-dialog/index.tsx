'use client';

import { useCallback } from 'react';
import { useTranslations } from 'next-intl';

import { useModalDialog } from '@/lib/primitives/modal/hooks';
import { useCurrentShift } from '@/lib/entities/cash-desk/hooks/useCurrentShift';
import { useShiftHistory } from '@/lib/entities/cash-desk/hooks/useShiftHistory';

import { CloseShiftDialogForm, CloseShiftDialogFormProps } from './form';

export function useCloseShiftDialog() {
  const t = useTranslations('cash_desk.shifts.close_shift_dialog');
  const dialog = useModalDialog();
  const { data: currentShift, refresh: refreshShift } = useCurrentShift();
  const { refresh: refreshHistory } = useShiftHistory(1, 30);

  const handleSuccess = useCallback(() => {
    refreshShift();
    refreshHistory();
  }, [refreshShift, refreshHistory]);

  return useCallback(() => {
    if (!currentShift || currentShift.status !== 'open') {
      return;
    }

    const shiftId = currentShift.shift_id || '';
    if (!shiftId) {
      return;
    }

    dialog.launch({
      dialog: true,
      autoClose: false,
      footer: false,
      title: t('title'),
      render: (
        <CloseShiftDialogForm
          shiftId={shiftId}
          onSuccess={handleSuccess}
        />
      ),
    });
  }, [dialog, t, currentShift, handleSuccess]);
}
