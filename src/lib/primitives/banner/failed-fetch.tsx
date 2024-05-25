import type { FC } from 'react';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import type { PostgrestError } from '@supabase/supabase-js';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export const FailedFetchBanner: FC<{ error: PostgrestError }> = ({ error }) => {
  return (
    <div className="max-w-screen-sm">
      <Alert variant="destructive">
        <ExclamationTriangleIcon className="h-4 w-4" />
        <AlertTitle>
          Server error {error.code} :: {error.message}
        </AlertTitle>
        <AlertDescription>
          {error.hint}
          {error.details}
        </AlertDescription>
      </Alert>
    </div>
  );
};
