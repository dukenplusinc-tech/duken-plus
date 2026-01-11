import { useCallback } from 'react';

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
 * Hook for handling phone calls with Android WebView compatibility
 * @param phoneNumber - Phone number in any format (e.g., "+7 (707) 892-08-77")
 * @returns Object with normalized phone number and click handler
 */
export function usePhoneCall(phoneNumber: string | null | undefined) {
  const normalizedPhone = phoneNumber ? normalizeTel(phoneNumber) : '';

  const handlePhoneClick = useCallback(
    (e?: React.MouseEvent<HTMLAnchorElement>) => {
      if (e) {
        e.preventDefault();
      }
      if (normalizedPhone) {
        // Create a temporary anchor element and click it for better Android WebView compatibility
        const link = document.createElement('a');
        link.href = `tel:${normalizedPhone}`;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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
