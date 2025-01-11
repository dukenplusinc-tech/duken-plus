import { createContext, ReactNode } from 'react';

export interface DialogWrapperProps {
  autoClose?: boolean;
  open: boolean;
  setOpen?: (status: boolean) => void;
  dialog?: boolean;
  desktopMedia?: string;
  title?: string;
  description?: string;
  cancelCaption?: string;
  acceptCaption?: string;
  dialogClassName?: string;

  onCancel?: () => void;
  onAccept?: () => void;
}

export interface DialogModalPayload
  extends Omit<DialogWrapperProps, 'open' | 'setOpen'> {
  render?: ReactNode;
}

export type OnCloseHandler = () => void;
export type OnCloseHandlerCleanFn = () => void;
export type OnClose = (cb?: OnCloseHandler) => OnCloseHandlerCleanFn;

export interface DialogModalCtxType {
  close: () => void;
  onClose: OnClose;
  launch: (payload: DialogModalPayload) => void;
}

export const DialogModalCtx = createContext<DialogModalCtxType | null>(null);
