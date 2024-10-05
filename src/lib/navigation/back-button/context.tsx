import { createContext, FC, ReactNode, useContext, useState } from 'react';

// Define the context type
interface BackButtonContextType {
  showBackButton: boolean;
  setShowBackButton: (value: boolean) => void;
}

// Create the context with default values
const BackButtonContext = createContext<BackButtonContextType | undefined>(
  undefined
);

// Custom hook to use the context
export const useBackButton = () => {
  const context = useContext(BackButtonContext);
  if (!context) {
    throw new Error('useBackButton must be used within a BackButtonProvider');
  }
  return context;
};

// Provider component to wrap around the app or pages where the state is needed
export const BackButtonProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [showBackButton, setShowBackButton] = useState(false);

  return (
    <BackButtonContext.Provider value={{ showBackButton, setShowBackButton }}>
      {children}
    </BackButtonContext.Provider>
  );
};
