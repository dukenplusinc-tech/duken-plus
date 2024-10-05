import { useEffect } from 'react';

import { useBackButton } from '@/lib/navigation/back-button/context';

export function useActivateBackButton() {
  const { setShowBackButton } = useBackButton();

  useEffect(() => {
    // Show the back button on this page
    setShowBackButton(true);

    // Optionally hide it when leaving the page
    return () => setShowBackButton(false);
  }, [setShowBackButton]);
}
