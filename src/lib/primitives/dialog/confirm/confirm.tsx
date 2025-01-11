import { useCallback, useMemo, useState } from 'react';

import { useDialogCtx } from '@/lib/primitives/dialog/context';

type Handler = (ids?: string[]) => Promise<void>;

interface ConfirmActionParams {
  title?: string;
  description?: string;
  acceptCaption?: string;
  cancelCaption?: string;
  onConfirm: Handler;
}

export const useConfirmAction = ({
  onConfirm,
  title,
  description,
  acceptCaption,
  ...props
}: ConfirmActionParams) => {
  const dialog = useDialogCtx();

  const [processing, setProcessing] = useState(false);

  const onAction = useCallback(
    (...args: any[]) => {
      setProcessing(true);

      dialog.launch({
        ...props,
        title: title || 'Action',
        description: description || 'Do you really want to do this?',
        actionCaption: acceptCaption || 'Continue',
        onAction: onConfirm.bind(null, ...args),
        onModalClosed: () => {
          setProcessing(false);
        },
      });
    },
    [acceptCaption, description, dialog, onConfirm, props, title]
  );

  return useMemo(
    () => ({
      onAction,
      processing,
    }),
    [onAction, processing]
  );
};

export type ConfirmActionPopUp = ReturnType<typeof useConfirmAction>;
