'use client';

import type { FC } from 'react';

import { useDeleteUser } from '@/lib/entities/users/hooks/useDeleteUser';
import { useUsers } from '@/lib/entities/users/hooks/useUsers';
import { DataTable } from '@/components/table';
import { DataTableToolbar } from '@/components/table/toolbar';

import { columns } from './columns';

const initialVisibility = {
  trace: true,
};

export const UsersTable: FC = () => {
  const { data, count, isLoading, error } = useUsers();

  const deleteUsers = useDeleteUser();

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
        {...deleteUsers}
      ></DataTableToolbar>
    </DataTable>
  );
};
