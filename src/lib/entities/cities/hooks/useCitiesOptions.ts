'use client';

import { useOptions } from '@/lib/composite/form/useOptions';

export const useCitiesOptions = () => {
  return useOptions({
    table: 'cities',
    columns: `
      value:id,
      label:title
    `,
  });
};
