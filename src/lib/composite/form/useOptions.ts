'use client';

import { useMemo } from 'react';
import { z } from 'zod';

import { useQuery } from '@/lib/supabase/query';

export const schema = z.object({
  value: z.string().or(z.number()),
  label: z.string(),
  group: z.string().optional(),
});

export type Option = z.infer<typeof schema>;

export type GroupedOption = {
  group: string;
  list: Option[];
};

export const useOptions = ({
  table,
  columns,
}: {
  table: string;
  columns: string;
}) => {
  const { data } = useQuery<Option[]>(table, columns, {
    schema,
  });

  return data || [];
};

export const useOptionsGroup = (params: {
  table: string;
  columns: string;
}): GroupedOption[] => {
  const list = useOptions(params);

  return useMemo(() => {
    return list.reduce((result, currentValue) => {
      // Check if the group already exists
      const group = result.find((item) => item.group === currentValue.group);

      // If the group exists, add the current value to the list
      if (group) {
        group.list.push(currentValue);
      } else {
        // If the group doesn't exist, create a new group with the current value
        result.push({
          group: currentValue.group!,
          list: [currentValue],
        });
      }

      return result;
    }, [] as GroupedOption[]);
  }, [list]);
};
