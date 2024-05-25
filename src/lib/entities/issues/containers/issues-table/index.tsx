'use client';

import type { FC } from 'react';

import { IssuesFilterByDeviceId } from '@/lib/entities/issues/containers/issues-filters/issues-filter-by-device-id';
import { useDeleteIssueWithConfirm } from '@/lib/entities/issues/hooks/useDeleteIssueWithConfirm';
import { useIssues } from '@/lib/entities/issues/hooks/useIssues';
import { DataTable } from '@/components/table';
import { DataTableToolbar } from '@/components/table/toolbar';

import { columns } from './columns';

const initialVisibility = {
  trace: true,
};

export const IssuesTable: FC = () => {
  const { data, count, isLoading, error } = useIssues();

  const deleteIssues = useDeleteIssueWithConfirm();

  return (
    <DataTable
      initialVisibility={initialVisibility}
      data={data}
      count={count!}
      columns={columns}
      isLoading={isLoading}
      error={error}
    >
      <DataTableToolbar filterByColumn="title" {...deleteIssues}>
        <IssuesFilterByDeviceId />
      </DataTableToolbar>
    </DataTable>
  );
};
