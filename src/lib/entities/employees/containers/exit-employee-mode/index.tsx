'use client';

import { FC, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { isValidAdminPin } from '@/lib/entities/employees/actions/isValidAdminPin';
import { PinSection } from '@/lib/entities/employees/containers/employee-mode/PinSection';
import { EmployeeModeProps } from '@/lib/entities/employees/containers/employee-mode/types';
import { useEmployeeCtx } from '@/lib/entities/employees/context';
import * as fromUrl from '@/lib/url/generator';
import { toast } from '@/components/ui/use-toast';

export const ExitEmployeeMode: FC<EmployeeModeProps> = ({ onSuccess }) => {
  const router = useRouter();
  const ctx = useEmployeeCtx();
  const t = useTranslations('employees.exit');

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

  const getErrorMessage = (error: unknown): string => {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    // Handle specific error messages from the server action
    if (errorMessage.includes('Wrong PIN')) {
      return t('errors.wrong_pin');
    }
    if (errorMessage.includes('Failed to find current user')) {
      return t('errors.user_not_found');
    }
    if (errorMessage.includes('Failed to find profile')) {
      return t('errors.profile_not_found');
    }
    
    // Handle Next.js production errors (they contain "Server Components render" or "digest")
    if (
      errorMessage.includes('Server Components render') ||
      errorMessage.includes('digest') ||
      errorMessage.includes('production builds')
    ) {
      return t('errors.generic');
    }
    
    // For other errors, try to show a user-friendly message or fallback to generic
    return t('errors.generic');
  };

  const handleSubmit = async () => {
    // Basic client-side PIN validation.
    if (pin.some((digit) => digit === '')) {
      toast({
        variant: 'destructive',
        title: t('errors.incomplete_pin'),
      });
      return;
    }

    setIsLoading(true);

    try {
      const isValid = await isValidAdminPin(pin.join(''));

      if (!isValid) {
        throw new Error('Wrong PIN');
      }

      ctx.clearSession();

      if (onSuccess) {
        onSuccess();
      }

      router.push(fromUrl.toHome());
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast({
        variant: 'destructive',
        title: t('errors.title'),
        description: errorMessage,
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
