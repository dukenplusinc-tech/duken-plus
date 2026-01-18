'use client';

import { FC, useEffect, useState } from 'react';

import { Input } from '@/components/ui/input';

interface PhoneInputSimpleProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  autoComplete?: string;
}

// Kazakhstan phone format: +7 (XXX) XXX-XX-XX
const KZ_PHONE_PREFIX = '+7';

// Format phone number as user types
function formatPhoneNumber(value: string): string {
  if (!value || value.trim() === '') {
    return '';
  }

  // Remove all non-digit characters except +
  let digits = value.replace(/[^\d+]/g, '');

  // Handle empty or just +
  if (!digits || digits === '+') {
    return digits || '';
  }

  // If it starts with +7, format as Kazakhstan mobile: +7 (XXX) XXX-XX-XX
  if (digits.startsWith('+7')) {
    // Limit to Kazakhstan mobile length: +7 + 10 digits
    if (digits.length > 12) {
      digits = digits.slice(0, 12);
    }

    // Format: +7 (XXX) XXX-XX-XX
    if (digits.length <= 2) {
      return digits;
    }

    const code = digits.slice(2, 5); // First 3 digits after +7
    const part1 = digits.slice(5, 8); // Next 3 digits
    const part2 = digits.slice(8, 10); // Next 2 digits
    const part3 = digits.slice(10, 12); // Last 2 digits

    let formatted = KZ_PHONE_PREFIX;

    if (code) {
      formatted += ` (${code}`;
      if (part1) {
        formatted += `) ${part1}`;
        if (part2) {
          formatted += `-${part2}`;
          if (part3) {
            formatted += `-${part3}`;
          }
        }
      } else {
        formatted += ')';
      }
    }

    return formatted;
  }

  // For landline numbers (not starting with +7), return as-is with basic formatting
  return value.replace(/[^\d+\s\-()]/g, '');
}

export const PhoneInputSimple: FC<PhoneInputSimpleProps> = ({
  id,
  value,
  onChange,
  placeholder,
  disabled = false,
  className,
  autoComplete = 'tel',
}) => {
  const [displayValue, setDisplayValue] = useState(
    value ? formatPhoneNumber(value) : KZ_PHONE_PREFIX
  );

  // Update display value when external value changes
  useEffect(() => {
    if (value) {
      setDisplayValue(formatPhoneNumber(value));
    } else {
      // Default to +7 for optional fields
      setDisplayValue(KZ_PHONE_PREFIX);
    }
  }, [value]);

  const handleInput = (inputValue: string) => {
    // Allow user to delete +7 completely for landline numbers
    if (!inputValue || inputValue.trim() === '') {
      // For optional fields, allow empty
      setDisplayValue('');
      onChange('');
      return;
    }

    const formatted = formatPhoneNumber(inputValue);
    setDisplayValue(formatted);
    
    // Send the formatted value (can be empty, +7, or full number)
    if (formatted === '' || formatted === '+') {
      onChange('');
    } else {
      onChange(formatted);
    }
  };

  const handleFocus = () => {
    // If empty, set to +7
    if (!value || value === '' || value === null) {
      setDisplayValue(KZ_PHONE_PREFIX);
      onChange(KZ_PHONE_PREFIX);
    }
  };

  return (
    <Input
      id={id}
      type="tel"
      value={displayValue || ''}
      onChange={(e) => handleInput(e.target.value)}
      onFocus={handleFocus}
      disabled={disabled}
      placeholder={placeholder}
      className={className}
      autoComplete={autoComplete}
    />
  );
};
