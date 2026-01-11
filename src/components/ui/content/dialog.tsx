import { FC, ReactNode, useCallback } from 'react';
import { Phone } from 'lucide-react';

interface InfoRowProps {
  label: string | ReactNode;
  value: string | ReactNode;
  /** If true and value is a string, render a tel: link with a phone icon */
  phone?: boolean;
}

function normalizeTel(input: string) {
  // keep leading +, strip everything else non-digit
  const trimmed = input.trim();
  const hasPlus = trimmed.startsWith('+');
  const digits = trimmed.replace(/[^\d]/g, '');
  return hasPlus ? `+${digits}` : digits;
}

export const InfoRow: FC<InfoRowProps> = ({ label, value, phone }) => {
  const isString = typeof value === 'string';
  const normalizedPhone = isString ? normalizeTel(value as string) : '';
  const telHref = isString ? `tel:${normalizedPhone}` : undefined;

  const handlePhoneClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
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

  return (
    <div className="flex justify-between items-start py-2">
      <span className="w-1/2 text-gray-700 text-lg flex justify-start">
        {label}:
      </span>

      {phone && isString ? (
        <span className="w-1/2 text-gray-900 text-lg">
          <a
            href={telHref}
            onClick={handlePhoneClick}
            className="flex justify-end items-center gap-2 font-bold cursor-pointer"
            aria-label={`Call ${value}`}
          >
            <Phone className="h-5 w-5 shrink-0" aria-hidden="true" />
            <span className="truncate">{value as string}</span>
          </a>
        </span>
      ) : (
        <span className="w-1/2 text-gray-900 text-lg text-right">
          {isString ? <span className="font-bold">{value}</span> : value}
        </span>
      )}
    </div>
  );
};
