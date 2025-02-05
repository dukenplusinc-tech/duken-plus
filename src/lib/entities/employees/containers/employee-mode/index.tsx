'use client';

import { FC, PropsWithChildren, useState } from 'react';

import { enableEmployeeMode } from '@/lib/entities/employees/actions/enableEmployeeMode';
import { useEmployeeSession } from '@/lib/entities/employees/hooks/useEmployeeSession';
import { Card } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';

import { BackButton } from './BackButton';
import { EmployeeSelect } from './EmployeeSelect';
import { Header } from './Header';
import { PinSection } from './PinSection';

export const EmployeeMode: FC<PropsWithChildren> = () => {
  const sessionManager = useEmployeeSession();

  console.log({ existingSession: sessionManager.getToken() });

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

  const handleSubmit = async () => {
    // Basic client-side PIN validation.
    if (pin.some((digit) => digit === '')) {
      alert('Please enter a complete PIN');
      return;
    }
    setIsLoading(true);
    try {
      const session = await enableEmployeeMode({
        employeeId: selectedEmployeeId,
        pin: pin.join(''),
      });

      if (!session?.id) {
        throw new Error('Failed to enable employee mode');
      }

      sessionManager.saveToken(session.session_token);

      console.log('Employee session:', session);
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
    <div className="h-full flex items-center justify-center">
      <Card className="w-full max-w-md p-6 space-y-8 relative">
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
      </Card>
    </div>
  );
};
