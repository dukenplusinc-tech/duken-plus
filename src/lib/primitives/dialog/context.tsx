import { createContext, ReactNode, useContext } from 'react';

type Handler = () => void | Promise<void>;

export interface DialogActions {
  onCancel?: null | Handler;
  onAction?: null | Handler;
  onClose?: null | Handler;
}

export interface LaunchParams extends DialogActions {
  title?: string;
  description?: string;
}

export interface DialogContextState extends DialogActions {
  render?: ReactNode | null;
  launch: (params?: LaunchParams) => void;
}

export const DialogContext = createContext<DialogContextState>({
  render: null,
  launch() {},
});

export const useDialogCtx = () => {
  return useContext(DialogContext);
};
