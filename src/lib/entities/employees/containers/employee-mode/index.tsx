'use client';

import { FC } from 'react';
import { Loader2 as Loader } from 'lucide-react';

import { useEmployeeCtx } from '@/lib/entities/employees/context';

import { EmployeeModeLogin } from './employee-login';
import type { EmployeeModeProps } from './types';

export const EmployeeMode: FC<EmployeeModeProps> = ({ onSuccess }) => {
  const sessionManager = useEmployeeCtx();

  if (sessionManager.isLoading) {
    return (
      <div className="h-full flex justify-center items-center">
        <Loader className="animate-spin ml-2 h-10 w-10" />
      </div>
    );
  }

  return <EmployeeModeLogin onSuccess={onSuccess} />;
};
