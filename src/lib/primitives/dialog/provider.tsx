'use client';

import { FC, PropsWithChildren, useCallback, useEffect, useState } from 'react';

import { safeInvoke } from '@/lib/primitives/async/safe-invoke';

import { DialogContext, DialogContextState, LaunchParams } from './context';
import { RenderDialog } from './render-dialog';

export const DialogProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, setState] = useState<Partial<DialogContextState>>({
    render: null,
    onAction: null,
    onCancel: null,
    onClose: null,
    onModalClosed: null,
  });

  const { onCancel, onAction, onClose } = state;

  const handleCancel = useCallback(async () => {
    await safeInvoke(onCancel, { toast: true });

    setState((prevState) => ({ ...prevState, render: null }));

    await safeInvoke(onClose);
  }, [onCancel, onClose]);

  const handleAction = useCallback(async () => {
    await safeInvoke(onAction, { toast: true });

    setState((prevState) => ({ ...prevState, render: null }));

    await safeInvoke(onClose, { toast: true });
  }, [onAction, onClose]);

  const launch = useCallback(
    (params?: LaunchParams) => {
      setState({
        onAction: params?.onAction,
        onCancel: params?.onCancel,
        onClose: params?.onClose,
        onModalClosed: params?.onModalClosed,
        render: (
          <RenderDialog
            title={params?.title}
            description={params?.description}
            onCancel={handleCancel}
            onAction={handleAction}
          />
        ),
      });
    },
    [handleCancel, handleAction]
  );

  const value = {
    ...state,
    launch,
  };

  useEffect(() => {
    if (!state.render && state.onModalClosed) {
      safeInvoke(state.onModalClosed).then();
    }
  }, [state.onModalClosed, state.render]);

  return (
    <DialogContext.Provider value={value}>
      {children}
      {state.render}
    </DialogContext.Provider>
  );
};
