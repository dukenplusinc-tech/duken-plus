'use client';

import { FC, PropsWithChildren, useCallback, useState } from 'react';

import { safeInvoke } from '@/lib/primitives/async/safe-invoke';

import { DialogContext, DialogContextState, LaunchParams } from './context';
import { RenderDialog } from './render-dialog';

export const DialogProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, setState] = useState<Partial<DialogContextState>>({
    render: null,
    onAction: null,
    onCancel: null,
    onClose: null,
  });

  const { onCancel, onAction, onClose } = state;

  const handleCancel = useCallback(async () => {
    await safeInvoke(onCancel);

    setState((prevState) => ({ ...prevState, render: null }));

    await safeInvoke(onClose);
  }, [onCancel, onClose]);

  const handleAction = useCallback(async () => {
    await safeInvoke(onAction);

    setState((prevState) => ({ ...prevState, render: null }));

    await safeInvoke(onClose);
  }, [onAction, onClose]);

  const launch = useCallback(
    (params?: LaunchParams) => {
      setState({
        onAction: params?.onAction,
        onCancel: params?.onCancel,
        onClose: params?.onClose,
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

  return (
    <DialogContext.Provider value={value}>
      {children}
      {state.render}
    </DialogContext.Provider>
  );
};
