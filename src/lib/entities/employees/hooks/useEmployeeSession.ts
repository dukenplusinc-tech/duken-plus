'use client';

import { useMemo } from 'react';

const EMPLOYEE_TOKEN = 'EMPLOYEE_TOKEN';

export function useEmployeeSession() {
  return useMemo(() => {
    return {
      saveToken(value: string) {
        localStorage.setItem(EMPLOYEE_TOKEN, value);
      },
      getToken(): string | null {
        return localStorage.getItem(EMPLOYEE_TOKEN) || null;
      },
    };
  }, []);
}
