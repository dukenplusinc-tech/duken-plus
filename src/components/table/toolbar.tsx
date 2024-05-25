'use client';

import { PropsWithChildren } from 'react';

import type { ConfirmDeleteContact } from '@/lib/primitives/dialog/confirm/delete';
import { useDataTable } from '@/components/table/data-table-context';
import { DataTableViewOptions } from '@/components/table/data-table-view-options';
import { DataTableDeleteButton } from '@/components/table/delete';
import { DataTableSearchBy } from '@/components/table/filters/search-by';

interface DataTableToolbarProps<TData>
  extends PropsWithChildren<ConfirmDeleteContact> {
  filterByColumn?: string;
}

export function DataTableToolbar<TData>({
  processing,
  onDelete,
  filterByColumn,
  children,
}: DataTableToolbarProps<TData>) {
  const table = useDataTable<TData>();

  return (
    <div className="flex items-center justify-between">
      <div className="flex space-x-2">
        {filterByColumn && (
          <DataTableSearchBy filterByColumn={filterByColumn} />
        )}
        {children}
      </div>

      <div className="flex space-x-2">
        <DataTableDeleteButton
          table={table}
          processing={processing}
          onDelete={onDelete}
        />
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
