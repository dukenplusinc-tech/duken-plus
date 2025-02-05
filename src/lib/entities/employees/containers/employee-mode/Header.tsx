import { FC } from 'react';

import { useEmployee } from '@/lib/entities/employees/hooks/useEmployee';

interface HeaderProps {
  stage: 'select-user' | 'enter-pin';
  selectedEmployeeId: string;
}

export const Header: FC<HeaderProps> = ({ stage, selectedEmployeeId }) => {
  const { data: employee } = useEmployee(selectedEmployeeId);
  const employeeName = employee?.full_name || '';

  return (
    <div className="space-y-2 text-center">
      <h1 className="text-2xl font-bold tracking-tight">Welcome Back</h1>
      <p className="text-muted-foreground">
        {stage === 'select-user'
          ? 'Please select your profile to continue'
          : `Enter PIN for ${employeeName}`}
      </p>
    </div>
  );
};
