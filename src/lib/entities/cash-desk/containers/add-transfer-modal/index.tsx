'use client';

import { useCallback } from 'react';
import { useTranslations } from 'next-intl';

import { CashRegisterType } from '@/lib/entities/cash-desk/schema';
import { useModalDialog } from '@/lib/primitives/modal/hooks';
import { useCurrentShift } from '@/lib/entities/cash-desk/hooks/useCurrentShift';
import { useCashDeskStat } from '@/lib/entities/cash-desk/hooks/useCashDeskStat';

import { AddTransferModalForm, AddTransferModalProps } from './form';

export function useAddTransferModal() {
  const tModal = useTranslations('cash_desk.shifts.add_transfer_modal');
  const dialog = useModalDialog();
  const { refresh: refreshShift } = useCurrentShift();
  const { refresh: refreshStats } = useCashDeskStat();

  const handleSuccess = useCallback(async () => {
    await refreshShift();
    setTimeout(async () => {
      await refreshStats();
    }, 300);
  }, [refreshShift, refreshStats]);

  return useCallback(
    (props?: Omit<AddTransferModalProps, 'onSuccess'>) => {
      dialog.launch({
        dialog: true,
        autoClose: false,
        footer: false,
        title: tModal('title'),
        render: (
          <AddTransferModalForm
            type={CashRegisterType.BANK_TRANSFER}
            onSuccess={handleSuccess}
            {...props}
          />
        ),
      });
    },
    [dialog, tModal, handleSuccess]
  );
}
