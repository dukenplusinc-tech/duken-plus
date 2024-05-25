import {FC, useCallback, useState} from "react";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction
} from "@/components/ui/alert-dialog";

import {saveInvoke} from "@/lib/primitives/async/safe-invoke";

import type {LaunchParams} from './context'

export interface RenderDialogProps extends LaunchParams {
  cancelCaption?: string
  actionCaption?: string

  onCancel: () => void;
  onAction: () => void;
}

export const RenderDialog: FC<RenderDialogProps> = (props) => {
  const {
    title,
    description,
    onCancel,
    onAction,
    cancelCaption = 'Cancel',
    actionCaption = 'Continue'
  } = props;

  const [isLoading, setIsLoading] = useState(false)

  const handleCancel = useCallback(async () => {
    setIsLoading(true);
    await saveInvoke(onCancel);
    setIsLoading(false);
  }, [onCancel])

  const handleAction = useCallback(async () => {
    setIsLoading(true);
    await saveInvoke(onAction);
    setIsLoading(false);
  }, [onAction])

  return (
    <AlertDialog open>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title || 'Are you absolutely sure?'}</AlertDialogTitle>
          <AlertDialogDescription>
            {description || `This action cannot be undone. This will permanently remove your data from our servers.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading} onClick={handleCancel}>{cancelCaption}</AlertDialogCancel>
          <AlertDialogAction disabled={isLoading} onClick={handleAction}>{actionCaption}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}