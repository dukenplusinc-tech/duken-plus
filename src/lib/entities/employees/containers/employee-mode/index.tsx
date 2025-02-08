'use client';

import { FC, PropsWithChildren } from 'react';
import { Loader2 as Loader } from 'lucide-react';

import { useEmployeeCtx } from '@/lib/entities/employees/context';

import { EmployeeModeLogin } from './employee-login';

export const EmployeeModeGuard: FC<PropsWithChildren> = ({ children }) => {
  const sessionManager = useEmployeeCtx();

  if (sessionManager.isLoading) {
    return (
      <div className="h-full flex justify-center items-center">
        <Loader className="animate-spin ml-2 h-10 w-10" />
      </div>
    );
  }

  if (sessionManager.session?.sessionToken) {
    return children;
  }

  return <EmployeeModeLogin />;
};
