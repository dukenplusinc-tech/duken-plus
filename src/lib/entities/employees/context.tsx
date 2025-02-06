'use client';

import React, {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';

import { isValidToken } from '@/lib/entities/employees/actions/isValidToken';

interface EmployeeSession {
  sessionToken: string;
}

interface EmployeeModeContextValue {
  session: EmployeeSession | null;
  isLoading: boolean;
  saveSession: (session: EmployeeSession) => void;
  clearSession: () => void;
}

const EMPLOYEE_TOKEN_KEY = 'EMPLOYEE_TOKEN';

const EmployeeModeContext = createContext<EmployeeModeContextValue | undefined>(
  undefined
);

export const EmployeeModeProvider: FC<PropsWithChildren> = ({ children }) => {
  const [session, setSession] = useState<EmployeeSession | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // On mount, load session token from localStorage if available.
  useEffect(() => {
    const token = localStorage.getItem(EMPLOYEE_TOKEN_KEY);
    if (token) {
      setSession({ sessionToken: token });
    }
  }, []);

  useEffect(() => {
    // validate token
    if (session?.sessionToken) {
      setIsLoading(true);

      isValidToken({
        session_token: session.sessionToken,
      })
        .then((isOk) => {
          if (!isOk) {
            localStorage.removeItem(EMPLOYEE_TOKEN_KEY);
            setSession(null);
          }
        })
        .catch(() => {
          localStorage.removeItem(EMPLOYEE_TOKEN_KEY);
          setSession(null);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [session?.sessionToken]);

  const saveSession = (session: EmployeeSession) => {
    localStorage.setItem(EMPLOYEE_TOKEN_KEY, session.sessionToken);
    setSession(session);
  };

  const clearSession = () => {
    localStorage.removeItem(EMPLOYEE_TOKEN_KEY);
    setSession(null);
  };

  return (
    <EmployeeModeContext.Provider
      value={{ session, saveSession, clearSession, isLoading }}
    >
      {children}
    </EmployeeModeContext.Provider>
  );
};

export const useEmployeeCtx = () => {
  const context = useContext(EmployeeModeContext);
  if (!context) {
    throw new Error(
      'useEmployeeMode must be used within an EmployeeModeProvider'
    );
  }
  return context;
};

export const useEmployeeMode = () => {
  const ctx = useEmployeeCtx();

  return {
    isLoading: ctx.isLoading,
    isEmployee: Boolean(ctx.isLoading && ctx.session?.sessionToken),
    isAdmin: false,
  };
};
