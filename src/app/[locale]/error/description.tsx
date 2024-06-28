'use client';

import { FC, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

const useErrorDetails = () => {
  const pathname = usePathname();

  const [error, setError] = useState('');
  const [errorCode, setErrorCode] = useState('');
  const [errorDescription, setErrorDescription] = useState('');

  useEffect(() => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);

    const error = params.get('error');
    const errorCode = params.get('error_code');
    const errorDescription = params.get('error_description');

    setError(error ? error.split('_').join(' ') : 'Error');
    setErrorCode(errorCode || 'Unknown code');
    setErrorDescription(errorDescription || 'No description available');
  }, [pathname]);

  return { error, errorCode, errorDescription };
};

export const ErrorDescription: FC = () => {
  const { error, errorCode, errorDescription } = useErrorDetails();

  return (
    <div className="grid gap-2 text-center">
      <h1 className="text-3xl font-bold capitalize">{error}</h1>
      <p className="text-balance text-muted-foreground">
        Status Code: {errorCode}
      </p>
      <p className="text-balance text-muted-foreground">{errorDescription}</p>
    </div>
  );
};
