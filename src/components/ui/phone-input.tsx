'use client';

import { FC, useEffect, useState } from 'react';
import { IonInput, IonItem, IonLabel } from '@ionic/react';

interface PhoneInputProps {
  label: string;
  placeholder?: string;
  value: string | null;
  onChange: (value: string | null) => void;
  onBlur?: () => void;
  disabled?: boolean;
  error?: string;
  required?: boolean;
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
  // Allow digits, spaces, dashes, parentheses
  return value.replace(/[^\d+\s\-()]/g, '');
}

export const PhoneInput: FC<PhoneInputProps> = ({
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  disabled = false,
  error,
  required = false,
}) => {
  const [displayValue, setDisplayValue] = useState(
    value ? formatPhoneNumber(value) : KZ_PHONE_PREFIX
  );

  // Update display value when external value changes
  useEffect(() => {
    if (value) {
      setDisplayValue(formatPhoneNumber(value));
    } else {
      // Default to +7 for required fields, empty for optional
      setDisplayValue(required ? KZ_PHONE_PREFIX : '');
    }
  }, [value, required]);

  const handleInput = (inputValue: string) => {
    // Allow user to delete +7 completely for landline numbers
    if (!inputValue || inputValue.trim() === '') {
      if (required) {
        // For required fields, keep +7 as default
        setDisplayValue(KZ_PHONE_PREFIX);
        onChange(KZ_PHONE_PREFIX);
      } else {
        // For optional fields, allow empty
        setDisplayValue('');
        onChange(null);
      }
      return;
    }

    const formatted = formatPhoneNumber(inputValue);
    setDisplayValue(formatted);
    
    // Send the formatted value (can be empty, +7, or full number)
    if (formatted === '' || formatted === '+') {
      onChange(required ? KZ_PHONE_PREFIX : null);
    } else {
      onChange(formatted);
    }
  };

  const handleFocus = () => {
    // If empty, set to +7 for required fields
    if (!value || value === '') {
      if (required) {
        setDisplayValue(KZ_PHONE_PREFIX);
      }
    }
  };

  return (
    <>
      <IonItem>
        <IonLabel position="stacked">{label}</IonLabel>
        <IonInput
          type="tel"
          value={displayValue || ''}
          disabled={disabled}
          onIonInput={(e) => handleInput(e.detail.value!)}
          onIonBlur={onBlur}
          onFocus={handleFocus}
          placeholder={placeholder || label}
        />
      </IonItem>
      {error && (
        <IonLabel color="danger" className="ion-padding-start">
          {error}
        </IonLabel>
      )}
    </>
  );
};

