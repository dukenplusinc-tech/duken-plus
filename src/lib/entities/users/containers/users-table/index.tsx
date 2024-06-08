'use client';

import type { FC } from 'react';

// import { useDeleteIssueWithConfirm } from '@/lib/entities/users/hooks/useDeleteIssueWithConfirm';
import { useUsers } from '@/lib/entities/users/hooks/useUsers';
import { DataTable } from '@/components/table';
import { DataTableToolbar } from '@/components/table/toolbar';

import { columns } from './columns';

const initialVisibility = {
  trace: true,
};

export const UsersTable: FC = () => {
  const { data, count, isLoading, error } = useUsers();

  // const deleteIssues = useDeleteIssueWithConfirm();
  const deleteIssues = {} as any;

  return (
    <DataTable
      initialVisibility={initialVisibility}
      data={data}
      count={count!}
      columns={columns}
      isLoading={isLoading}
      error={error}
    >
      <DataTableToolbar
        filterByColumn="full_name"
        {...deleteIssues}
      ></DataTableToolbar>
    </DataTable>
  );
};
