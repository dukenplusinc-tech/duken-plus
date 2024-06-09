'use client';

import { useOptions } from '@/lib/composite/form/useOptions';

export const useRoleOptions = () => {
  return useOptions({
    table: 'roles',
    columns: `
      value:id,
      label:role
    `,
  });
};
