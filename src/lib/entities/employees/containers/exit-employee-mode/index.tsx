'use client';

import { FC, useState } from 'react';
import { useRouter } from 'next/navigation';

import { isValidAdminPin } from '@/lib/entities/employees/actions/isValidAdminPin';
import { PinSection } from '@/lib/entities/employees/containers/employee-mode/PinSection';
import { EmployeeModeProps } from '@/lib/entities/employees/containers/employee-mode/types';
import { useEmployeeCtx } from '@/lib/entities/employees/context';
import * as fromUrl from '@/lib/url/generator';
import { toast } from '@/components/ui/use-toast';

export const ExitEmployeeMode: FC<EmployeeModeProps> = ({ onSuccess }) => {
  const router = useRouter();
  const ctx = useEmployeeCtx();

  const [pin, setPin] = useState<string[]>(Array(4).fill(''));
  const [isLoading, setIsLoading] = useState(false);

  const handlePinInput = (digit: string) => {
    setPin((prev) => {
      const currentIndex = prev.findIndex((d) => d === '');
      if (currentIndex === -1) return prev;
      const newPin = [...prev];
      newPin[currentIndex] = digit;
      return newPin;
    });
  };

  const handlePinDelete = () => {
    setPin((prev) => {
      // Delete the last non-empty digit.
      const lastIndex = prev.lastIndexOf(prev.find((d) => d !== '') || '');
      if (lastIndex === -1) return prev;
      const newPin = [...prev];
      newPin[lastIndex] = '';
      return newPin;
    });
  };

  const handleSubmit = async () => {
    // Basic client-side PIN validation.
    if (pin.some((digit) => digit === '')) {
      alert('Please enter a complete PIN');
      return;
    }

    setIsLoading(true);

    try {
      const isValid = await isValidAdminPin(pin.join(''));

      if (!isValid) {
        // noinspection ExceptionCaughtLocallyJS
        throw new Error('Wrong PIN');
      }

      ctx.clearSession();

      if (onSuccess) {
        onSuccess();
      }

      router.push(fromUrl.toHome());
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
    <div className="py-8">
      <PinSection
        pin={pin}
        onPinInput={handlePinInput}
        onDelete={handlePinDelete}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
};
