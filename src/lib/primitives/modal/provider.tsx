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

import { useMediaQuery } from '@/lib/hooks/use-media-query';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
  desktopMedia = '(min-width: 768px)',
  cancelCaption = 'Cancel',
  dialogClassName,
}) => {
  const isDesktop = useMediaQuery(desktopMedia);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className={cn('sm:max-w-[425px]', dialogClassName)}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          {children}
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
              <Button variant="outline">{cancelCaption}</Button>
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
