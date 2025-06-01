'use client';

import { FC } from 'react';
import { useTranslations } from 'next-intl';

import { useEmployeeMode } from '@/lib/entities/employees/context';
import { useEnterEmployeeMode } from '@/lib/entities/employees/hooks/useEnterEmployeeMode';
import { useExitEmployeeMode } from '@/lib/entities/employees/hooks/useExitEmployeeMode';
import { Button } from '@/components/ui/button';

export const UserSwitcher: FC = () => {
  const t = useTranslations('menu');

  const employeeMode = useEmployeeMode();

  const handleExitEmployeeMode = useExitEmployeeMode();
  const handleEnterEmployeeMode = useEnterEmployeeMode();

  if (employeeMode.isEmployee) {
    return (
      <>
        <div className="my-5 flex justify-center">
          <span className="text-2xl font-bold">
            {employeeMode.session?.full_name || '---'}
          </span>
        </div>
        <div className="my-5 flex justify-center">
          <Button onClick={handleExitEmployeeMode}>
            {t('exit_cashier_mode')}
          </Button>
        </div>
      </>
    );
  }

  return (
    <div className="my-5 flex justify-center">
      <Button onClick={handleEnterEmployeeMode}>
        {t('enter_cashier_mode')}
      </Button>
    </div>
  );
};
