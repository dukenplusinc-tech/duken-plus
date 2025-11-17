'use client';

import { FC, PropsWithChildren, useCallback, useEffect, useState } from 'react';

import { safeInvoke } from '@/lib/primitives/async/safe-invoke';

import { DialogContext, DialogContextState, LaunchParams } from './context';
import { RenderDialog } from './render-dialog';

export const DialogProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, setState] = useState<Partial<DialogContextState>>({
    render: null,
    onModalClosed: null,
  });

  const launch = useCallback(
    (params?: LaunchParams) => {
      const handleCancel = async () => {
        await safeInvoke(params?.onCancel, { toast: true });

        setState((prevState) => ({ ...prevState, render: null }));

        await safeInvoke(params?.onClose);
      };

      const handleAction = async () => {
        await safeInvoke(params?.onAction, { toast: true });

        setState((prevState) => ({ ...prevState, render: null }));

        await safeInvoke(params?.onClose, { toast: true });
      };

      setState({
        onAction: params?.onAction,
        onCancel: params?.onCancel,
        onClose: params?.onClose,
        onModalClosed: params?.onModalClosed,
        render: (
          <RenderDialog
            title={params?.title}
            description={params?.description}
            actionCaption={params?.actionCaption || state?.actionCaption}
            cancelCaption={params?.cancelCaption || state?.cancelCaption}
            onCancel={handleCancel}
            onAction={handleAction}
          />
        ),
      });
    },
    [state?.actionCaption, state?.cancelCaption]
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
