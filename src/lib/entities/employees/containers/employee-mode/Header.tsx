import { FC } from 'react';
import { useTranslations } from 'next-intl';

import { useEmployee } from '@/lib/entities/employees/hooks/useEmployee';

interface HeaderProps {
  stage: 'select-user' | 'enter-pin';
  selectedEmployeeId: string;
}

export const Header: FC<HeaderProps> = ({ stage, selectedEmployeeId }) => {
  const t = useTranslations('employees.login');

  const { data: employee } = useEmployee(selectedEmployeeId);

  const employeeName = employee?.full_name || '';

  return (
    <div className="space-y-2 text-center">
      <h1 className="text-2xl font-bold tracking-tight">
        {t('welcome_message')}
      </h1>
      <p className="text-muted-foreground">
        {stage === 'select-user'
          ? t('select_profile_caption')
          : t('enter_pin_for_caption', { name: employeeName })}
      </p>
    </div>
  );
};
