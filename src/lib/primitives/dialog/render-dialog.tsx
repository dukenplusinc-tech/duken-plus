import { FC, useCallback, useState } from 'react';
import { useTranslations } from 'next-intl';

import { safeInvoke } from '@/lib/primitives/async/safe-invoke';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import type { LaunchParams } from './context';

export interface RenderDialogProps extends LaunchParams {
  cancelCaption?: string;
  actionCaption?: string;

  onCancel: () => void;
  onAction: () => void;
}

export const RenderDialog: FC<RenderDialogProps> = (props) => {
  const t = useTranslations('alert.delete');

  const {
    title,
    description,
    onCancel,
    onAction,
    cancelCaption = 'Cancel',
    actionCaption = 'Continue',
  } = props;

  const [isLoading, setIsLoading] = useState(false);

  const handleCancel = useCallback(async () => {
    setIsLoading(true);
    await safeInvoke(onCancel, { toast: true });
    setIsLoading(false);
  }, [onCancel]);

  const handleAction = useCallback(async () => {
    setIsLoading(true);
    await safeInvoke(onAction, { toast: true });
    setIsLoading(false);
  }, [onAction]);

  return (
    <AlertDialog open>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title || t('title')}</AlertDialogTitle>
          <AlertDialogDescription>
            {description || t('description')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading} onClick={handleCancel}>
            {cancelCaption}
          </AlertDialogCancel>
          <AlertDialogAction disabled={isLoading} onClick={handleAction}>
            {actionCaption}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
