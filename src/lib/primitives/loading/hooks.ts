'use client';

import { useEffect } from 'react';

import { useLoading } from './context';

/**
 * Hook to automatically show loading overlay when a form is processing
 * @param isProcessing - The processing state from your form hook
 */
export function useFormLoading(isProcessing: boolean) {
  const { setLoading } = useLoading();

  useEffect(() => {
    setLoading(isProcessing);
  }, [isProcessing, setLoading]);

  useEffect(() => {
    return () => setLoading(false);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
}

/**
 * Hook to manually control loading state
 * @returns Object with startLoading and stopLoading functions
 */
export function useLoadingControl() {
  const { startLoading, stopLoading } = useLoading();
  return { startLoading, stopLoading };
}
