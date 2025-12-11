import { useEffect } from 'react';

import { useBackButton } from '@/lib/navigation/back-button/context';

export function useActivateBackButton(backUrl?: string) {
  const { setShowBackButton, setBackButtonUrl } = useBackButton();

  useEffect(() => {
    // Show the back button on this page
    setShowBackButton(true);
    // Set back URL if provided
    setBackButtonUrl(backUrl || null);

    // Cleanup when leaving the page
    return () => {
      setShowBackButton(false);
      setBackButtonUrl(null);
    };
    // Setters from useState are stable, so we can omit them from deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update URL when it changes
  useEffect(() => {
    setBackButtonUrl(backUrl || null);
    // Setters from useState are stable
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backUrl]);
}
