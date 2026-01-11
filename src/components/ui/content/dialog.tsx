import { FC, ReactNode } from 'react';
import { Phone } from 'lucide-react';

import { usePhoneCall } from '@/lib/hooks/use-phone-call';

interface InfoRowProps {
  label: string | ReactNode;
  value: string | ReactNode;
  /** If true and value is a string, render a tel: link with a phone icon */
  phone?: boolean;
}

export const InfoRow: FC<InfoRowProps> = ({ label, value, phone }) => {
  const isString = typeof value === 'string';
  const { telHref, handlePhoneClick } = usePhoneCall(
    phone && isString ? (value as string) : undefined
  );

  return (
    <div className="flex justify-between items-start py-2">
      <span className="w-1/2 text-gray-700 text-lg flex justify-start">
        {label}:
      </span>

      {phone && isString && telHref ? (
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
