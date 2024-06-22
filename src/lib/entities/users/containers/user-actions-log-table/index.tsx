'use client';

import type { FC } from 'react';

import { useUserActionLogs } from '@/lib/entities/users/hooks/useUserActionLogs';
import { DataTable } from '@/components/table';

import { columns } from './columns';

export const UserActionsLog: FC<{ id: string }> = ({ id }) => {
  const { data, count, isLoading, error } = useUserActionLogs(id);

  return (
    <DataTable
      data={data}
      count={count!}
      columns={columns}
      isLoading={isLoading}
      error={error}
    />
  );
};
