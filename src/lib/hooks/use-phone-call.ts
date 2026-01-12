import { useCallback } from 'react';
import { AppLauncher } from '@capacitor/app-launcher';

/**
 * Normalizes phone number for tel: links
 * Keeps leading +, strips everything else non-digit
 */
function normalizeTel(input: string): string {
  const trimmed = input.trim();
  const hasPlus = trimmed.startsWith('+');
  const digits = trimmed.replace(/[^\d]/g, '');
  return hasPlus ? `+${digits}` : digits;
}

/**
 * Checks if running in Capacitor environment
 */
function isCapacitor(): boolean {
  return typeof window !== 'undefined' && (window as any).Capacitor !== undefined;
}

/**
 * Opens tel: URL using Capacitor App Launcher API or web fallback
 */
async function openTelUrl(url: string): Promise<void> {
  if (isCapacitor()) {
    try {
      await AppLauncher.openUrl({ url });
      return;
    } catch (error) {
      console.warn('Failed to open tel: URL with AppLauncher:', error);
    }
  }

  // Web fallback: create and click a link
  const link = document.createElement('a');
  link.href = url;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
    document.body.removeChild(link);
  }, 100);
}

/**
 * Hook for handling phone calls
 * Uses Capacitor App Launcher API when available, falls back to web methods
 * @param phoneNumber - Phone number in any format (e.g., "+7 (707) 892-08-77")
 * @returns Object with normalized phone number and click handler
 */
export function usePhoneCall(phoneNumber: string | null | undefined) {
  const normalizedPhone = phoneNumber ? normalizeTel(phoneNumber) : '';

  const handlePhoneClick = useCallback(
    async (e?: React.MouseEvent<HTMLAnchorElement>) => {
      if (e) {
        e.preventDefault();
      }
      if (normalizedPhone) {
        const telUrl = `tel:${normalizedPhone}`;
        await openTelUrl(telUrl);
      }
    },
    [normalizedPhone]
  );

  return {
    normalizedPhone,
    telHref: normalizedPhone ? `tel:${normalizedPhone}` : undefined,
    handlePhoneClick,
  };
}
