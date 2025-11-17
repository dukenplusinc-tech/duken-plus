import { useCallback, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';

import { toast } from '@/components/ui/use-toast';
import { useDialogCtx } from '@/lib/primitives/dialog/context';

type Handler = (ids?: string[]) => Promise<void>;

interface ConfirmDeleteParams {
  onConfirm: Handler;
}

export const useConfirmDelete = ({ onConfirm }: ConfirmDeleteParams) => {
  const dialog = useDialogCtx();
  const t = useTranslations('validation.success');

  const [processing, setProcessing] = useState(false);

  const onDelete = useCallback(
    (...args: any[]) => {
      setProcessing(true);

      const wrappedOnConfirm = async (ids?: string[]) => {
        try {
          await onConfirm(ids);
          toast({
            variant: 'success',
            title: t('deleted_title'),
            description: t('deleted_description'),
          });
        } catch (error) {
          // Error will be handled by safeInvoke in the dialog provider
          throw error;
        }
      };

      dialog.launch({
        onAction: wrappedOnConfirm.bind(null, ...args),
        onModalClosed: () => {
          setProcessing(false);
        },
      });
    },
    [dialog, onConfirm, t]
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
