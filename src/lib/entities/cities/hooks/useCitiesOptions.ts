'use client';

import { useOptionsGroup } from '@/lib/composite/form/useOptions';

export const useCitiesOptions = () => {
  return useOptionsGroup({
    table: 'cities',
    columns: `
      value:title,
      label:title,
      group:region
    `,
  });
};
