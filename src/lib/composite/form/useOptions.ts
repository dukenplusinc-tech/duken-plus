'use client';

import { z } from 'zod';

import { useQuery } from '@/lib/supabase/query';

export const schema = z.object({
  value: z.string().or(z.number()),
  label: z.string(),
});

export type Option = z.infer<typeof schema>;

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
