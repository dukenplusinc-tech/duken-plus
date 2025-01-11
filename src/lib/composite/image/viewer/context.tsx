import React, { createContext, useContext, useState } from 'react';

// Define the context shape
interface ImageViewerContextType {
  isOpen: boolean;
  imageUrl: string | null;
  openViewer: (url: string) => void;
  closeViewer: () => void;
}

// Create the context with a default value
const ImageViewerContext = createContext<ImageViewerContextType | undefined>(
  undefined
);

// Provider Component
export const InternalImageViewerProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const openViewer = (url: string) => {
    setImageUrl(url);
    setIsOpen(true);
  };

  const closeViewer = () => {
    setImageUrl(null);
    setIsOpen(false);
  };

  return (
    <ImageViewerContext.Provider
      value={{ isOpen, imageUrl, openViewer, closeViewer }}
    >
      {children}
    </ImageViewerContext.Provider>
  );
};

// Custom Hook to use the ImageViewerContext
export const useImageViewer = () => {
  const context = useContext(ImageViewerContext);
  if (!context) {
    throw new Error(
      'useImageViewer must be used within an ImageViewerProvider'
    );
  }
  return context;
};
