'use client';

import {
  FC,
  PropsWithChildren,
  ReactNode,
  useCallback,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTranslations } from 'next-intl';

import { useMediaQuery } from '@/lib/hooks/use-media-query';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';

import {
  DialogModalCtx,
  DialogModalCtxType,
  DialogModalPayload,
  DialogWrapperProps,
  OnClose,
  OnCloseHandler,
} from './context';

const DialogWrapper: FC<PropsWithChildren<DialogWrapperProps>> = ({
  open,
  setOpen,
  title,
  description,
  children,
  autoClose = true,
  dialog = false,
  desktopMedia = '(min-width: 768px)',
  acceptCaption = 'dialog.accept',
  cancelCaption = 'dialog.cancel',
  dialogClassName,
  onCancel,
  onAccept,
}) => {
  const t = useTranslations();

  const isDesktop = useMediaQuery(dialog ? '(min-width: 1px)' : desktopMedia);

  const closeDialog = useCallback(() => {
    if (setOpen) {
      setOpen(false);
    }
  }, [setOpen]);

  const handleAccept = useCallback(() => {
    if (autoClose) {
      closeDialog();
    }

    if (onAccept) {
      onAccept();
    }
  }, [autoClose, closeDialog, onAccept]);

  const handleCancel = useCallback(() => {
    if (autoClose) {
      closeDialog();
    }

    if (onCancel) {
      onCancel();
    }
  }, [autoClose, closeDialog, onCancel]);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className={dialogClassName}>
          <DialogHeader>
            <DialogTitle>{title || <span>&nbsp;</span>}</DialogTitle>
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>
          <div className="max-h-[65vh] overflow-y-auto px-4 py-2">
            {children}
          </div>
          <DialogFooter>
            <div className="flex flex-1 justify-around">
              {acceptCaption && (
                <Button
                  variant="success"
                  className="flex-1 mr-2"
                  onClick={handleAccept}
                >
                  {t(acceptCaption)}
                </Button>
              )}
              {cancelCaption && (
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={handleCancel}
                >
                  {t(cancelCaption)}
                </Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        <div className="px-4">{children}</div>
        {cancelCaption && (
          <DrawerFooter className="pt-2">
            <DrawerClose asChild>
              <Button variant="outline">{t(cancelCaption)}</Button>
            </DrawerClose>
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export const DialogModalProvider: FC<PropsWithChildren> = ({ children }) => {
  const id = useId();

  const handlersRef = useRef<Record<string, OnCloseHandler>>({});

  const [show, setShow] = useState(false);

  const [modalContent, setModalContent] = useState<ReactNode | undefined>(
    undefined
  );

  const [dialogProps, setDialogProps] = useState<DialogModalPayload>({});

  const close = useCallback(() => {
    setShow(false);

    // reset on close
    setModalContent(undefined);
    setDialogProps({});

    // invoke listeners
    Object.values(handlersRef.current).forEach((cb) => {
      if (typeof cb === 'function') {
        cb();
      }
    });
  }, []);

  /**
   * Register event handler for modal close
   */
  const onClose: OnClose = useCallback(
    (cb) => {
      if (cb) {
        handlersRef.current[id] = cb;
      }

      return function cleanUpDialogOnClose() {
        if (id in handlersRef.current) {
          delete handlersRef.current[id];
        }
      };
    },
    [id]
  );

  const ctx = useMemo<DialogModalCtxType>(
    () => ({
      close,
      onClose,
      launch({ render, ...props }) {
        setModalContent(render);
        setDialogProps(props);

        setShow(true);
      },
    }),
    [close, onClose]
  );

  return (
    <DialogModalCtx.Provider value={ctx}>
      {children}

      <DialogWrapper {...dialogProps} open={show} setOpen={setShow}>
        {modalContent}
      </DialogWrapper>
    </DialogModalCtx.Provider>
  );
};
