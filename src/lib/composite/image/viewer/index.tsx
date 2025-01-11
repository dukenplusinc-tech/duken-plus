import React, { FC, PropsWithChildren } from 'react';
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  Portal,
} from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

import { InternalImageViewerProvider, useImageViewer } from './context';

const ImageViewer: React.FC = () => {
  const { isOpen, imageUrl, closeViewer } = useImageViewer();

  if (!imageUrl) return null;

  return (
    <Dialog open={isOpen} onOpenChange={closeViewer}>
      <Portal>
        {/* Overlay and content inside a higher-z-index container */}
        <div id="image-viewer-container" className="fixed inset-0 z-[1100]">
          <DialogOverlay className="fixed inset-0 bg-black bg-opacity-50" />
          <DialogContent className="fixed inset-0 flex items-center justify-center">
            <div className="relative w-auto max-w-4xl">
              <button
                className="absolute top-2 right-2 bg-primary text-white p-2 rounded-xl hover:bg-primary/80"
                onClick={(event) => {
                  event.stopPropagation();
                  event.preventDefault();

                  closeViewer();
                }}
              >
                <X size={24} />
              </button>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt="Preview"
                className="max-w-full max-h-screen rounded-lg"
              />
            </div>
          </DialogContent>
        </div>
      </Portal>
    </Dialog>
  );
};

export const ImageViewerProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <InternalImageViewerProvider>
      {children}
      <ImageViewer />
    </InternalImageViewerProvider>
  );
};
