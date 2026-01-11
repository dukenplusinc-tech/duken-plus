import { FC, ReactNode } from 'react';
import { Phone } from 'lucide-react';

import { usePhoneCall } from '@/lib/hooks/use-phone-call';

interface PhoneLinkProps {
  phoneNumber: string;
  children?: ReactNode;
  className?: string;
  showIcon?: boolean;
  ariaLabel?: string;
}

/**
 * Reusable component for phone call links with Android WebView compatibility
 */
export const PhoneLink: FC<PhoneLinkProps> = ({
  phoneNumber,
  children,
  className = '',
  showIcon = true,
  ariaLabel,
}) => {
  const { telHref, handlePhoneClick } = usePhoneCall(phoneNumber);

  if (!telHref) {
    return <span className={className}>{children || phoneNumber}</span>;
  }

  return (
    <a
      href={telHref}
      onClick={handlePhoneClick}
      className={`cursor-pointer ${className}`}
      aria-label={ariaLabel || `Call ${phoneNumber}`}
    >
      {showIcon && <Phone className="h-5 w-5 shrink-0 inline-block mr-2" aria-hidden="true" />}
      {children || phoneNumber}
    </a>
  );
};
