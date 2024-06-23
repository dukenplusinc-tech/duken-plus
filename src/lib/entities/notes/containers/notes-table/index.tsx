'use client';

import type { FC } from 'react';

import { useDeleteNotes } from '@/lib/entities/notes/hooks/useDeleteNotes';
import { useNotes } from '@/lib/entities/notes/hooks/useNotes';
import { DataTable } from '@/components/table';
import { DataTableToolbar } from '@/components/table/toolbar';

import { columns } from './columns';

export const NotesTable: FC = () => {
  const { data, count, isLoading, error } = useNotes();

  const deleteProps = useDeleteNotes();

  return (
    <DataTable
      data={data}
      count={count!}
      columns={columns}
      isLoading={isLoading}
      error={error}
    >
      <DataTableToolbar
        filterByColumn="title"
        {...deleteProps}
      ></DataTableToolbar>
    </DataTable>
  );
};
