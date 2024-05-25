'use client';

import type { FC } from 'react';

import { useDeleteDeviceWithConfirm } from '@/lib/entities/devices/hooks/useDeleteDeviceWithConfirm';
import { useDevices } from '@/lib/entities/devices/hooks/useDevices';
import { DataTable } from '@/components/table';
import { DataTableToolbar } from '@/components/table/toolbar';

import { columns } from './columns';

const initialVisibility = {
  trace: true,
};

export const DevicesTable: FC = () => {
  const { data, count, isLoading, error } = useDevices();

  const toolbarProps = useDeleteDeviceWithConfirm();

  return (
    <DataTable
      initialVisibility={initialVisibility}
      data={data}
      count={count!}
      columns={columns}
      isLoading={isLoading}
      error={error}
    >
      <DataTableToolbar {...toolbarProps} />
    </DataTable>
  );
};
