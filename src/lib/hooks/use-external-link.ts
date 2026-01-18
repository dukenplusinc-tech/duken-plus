import { useCallback } from 'react';
import { AppLauncher } from '@capacitor/app-launcher';

/**
 * Checks if running in Capacitor environment
 */
function isCapacitor(): boolean {
  return typeof window !== 'undefined' && (window as any).Capacitor !== undefined;
}

/**
 * Opens external URL using Capacitor App Launcher API or web fallback
 */
async function openExternalUrl(url: string): Promise<void> {
  if (isCapacitor()) {
    try {
      await AppLauncher.openUrl({ url });
      return;
    } catch (error) {
      console.warn('Failed to open URL with AppLauncher:', error);
    }
  }

  // Web fallback: open in new window
  window.open(url, '_blank', 'noopener,noreferrer');
}

/**
 * Hook for handling external links
 * Uses Capacitor App Launcher API when available, falls back to web methods
 * @param url - External URL to open
 * @returns Click handler function
 */
export function useExternalLink(url: string) {
  const handleClick = useCallback(
    async (e?: React.MouseEvent<HTMLElement>) => {
      if (e) {
        e.preventDefault();
      }
      await openExternalUrl(url);
    },
    [url]
  );

  return { handleClick };
}
