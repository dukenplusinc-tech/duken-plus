import { useCallback, useMemo, useState } from 'react';

import { useDialogCtx } from '@/lib/primitives/dialog/context';

type Handler = () => Promise<void>;

interface ConfirmDeleteParams {
  onConfirm: Handler;
}

export const useConfirmDelete = ({ onConfirm }: ConfirmDeleteParams) => {
  const dialog = useDialogCtx();

  const [processing, setProcessing] = useState(false);

  const onDelete = useCallback(
    (...args: any[]) => {
      setProcessing(true);

      dialog.launch({
        onAction: onConfirm.bind(null, ...args),
        onClose: () => {
          setProcessing(false);
        },
      });
    },
    [dialog, onConfirm]
  );

  return useMemo(
    () => ({
      onDelete,
      processing,
    }),
    [onDelete, processing]
  );
};

export type ConfirmDeletePopUp = ReturnType<typeof useConfirmDelete>;
