'use client';

import { FC, PropsWithChildren, useState } from 'react';
import { useTranslations } from 'next-intl';

import { enableEmployeeMode } from '@/lib/entities/employees/actions/enableEmployeeMode';
import { useEmployeeCtx } from '@/lib/entities/employees/context';
import { toast } from '@/components/ui/use-toast';

import { BackButton } from './BackButton';
import { EmployeeSelect } from './EmployeeSelect';
import { Header } from './Header';
import { PinSection } from './PinSection';
import type { EmployeeModeProps } from './types';

export const EmployeeModeLogin: FC<PropsWithChildren<EmployeeModeProps>> = ({
  onSuccess,
}) => {
  const sessionManager = useEmployeeCtx();
  const t = useTranslations('employees.login');

  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
  const [pin, setPin] = useState<string[]>(Array(4).fill(''));
  const [stage, setStage] = useState<'select-user' | 'enter-pin'>(
    'select-user'
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleUserSelect = (id: string) => {
    setSelectedEmployeeId(id);
    setStage('enter-pin');
  };

  const handleBack = () => {
    setStage('select-user');
    setPin(Array(4).fill(''));
    setSelectedEmployeeId('');
  };

  const getErrorMessage = (error: unknown): string => {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    // Handle specific error messages from the server action
    if (errorMessage.includes('Wrong PIN code')) {
      return t('errors.wrong_pin');
    }
    if (errorMessage.includes('Unauthorized')) {
      return t('errors.unauthorized');
    }
    if (errorMessage.includes('Failed to find employee')) {
      return t('errors.employee_not_found');
    }
    if (errorMessage.includes('Failed to enable employee mode')) {
      return t('errors.failed_to_enable');
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
      const session = await enableEmployeeMode({
        employeeId: selectedEmployeeId,
        pin: pin.join(''),
      });

      if (!session) {
        throw new Error('Failed to enable employee mode');
      }

      sessionManager.saveSession({
        sessionToken: session.session_token,
        full_name: session.full_name || '---',
      });

      if (onSuccess) {
        onSuccess();
      }
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
    <div className="h-full flex items-center justify-center">
      <div className="w-full max-w-md p-6 space-y-8 relative">
        {stage === 'enter-pin' && <BackButton onClick={handleBack} />}
        <Header stage={stage} selectedEmployeeId={selectedEmployeeId} />
        {stage === 'select-user' ? (
          <EmployeeSelect
            onSelect={handleUserSelect}
            selectedEmployeeId={selectedEmployeeId}
          />
        ) : (
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
                const lastIndex = prev.lastIndexOf(
                  prev.find((d) => d !== '') || ''
                );
                if (lastIndex === -1) return prev;
                const newPin = [...prev];
                newPin[lastIndex] = '';
                return newPin;
              });
            }}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
};
