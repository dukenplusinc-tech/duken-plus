import { FC } from 'react';
import type { PostgrestError } from '@supabase/supabase-js';

export const ErrorScreen: FC<{ error: PostgrestError }> = ({ error }) => {
  return (
    <div className="flex justify-center items-center flex-1">
      <p style={{ textAlign: 'center' }}>
        {error.code}: {error.message} <br />
        {error.hint}
        {error.details}
      </p>
    </div>
  );
};
