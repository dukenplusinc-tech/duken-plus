'use client';

import { FC, useState } from 'react';

import { PinSection } from '@/lib/entities/employees/containers/employee-mode/PinSection';
import { toast } from '@/components/ui/use-toast';

export const ExitEmployeeMode: FC = () => {
  const [pin, setPin] = useState<string[]>(Array(4).fill(''));
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    // Basic client-side PIN validation.
    if (pin.some((digit) => digit === '')) {
      alert('Please enter a complete PIN');
      return;
    }
    setIsLoading(true);
    try {
      console.log('sssss');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to login',
        description: `${(error as Error)?.message}`,
      });
    } finally {
      setIsLoading(false);
      setPin(Array(4).fill(''));
    }
  };
  return (
    <PinSection
      pin={pin}
      onPinInput={(digit) => {
        setPin((prev) => {
          const currentIndex = prev.findIndex((d) => d === '');
          if (currentIndex === -1) return prev;
          const newPin = [...prev];
          newPin[currentIndex] = digit;
          return newPin;
        });
      }}
      onDelete={() => {
        setPin((prev) => {
          // Delete the last non-empty digit.
          const lastIndex = prev.lastIndexOf(prev.find((d) => d !== '') || '');
          if (lastIndex === -1) return prev;
          const newPin = [...prev];
          newPin[lastIndex] = '';
          return newPin;
        });
      }}
      onSubmit={handleSubmit}
      isLoading={isLoading}
    />
  );
};
