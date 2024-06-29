'use client';

import * as React from 'react';
import { PropsWithChildren } from 'react';
import type { PostgrestError } from '@supabase/supabase-js';
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { useTranslations } from 'next-intl';

import { useFiltersCtx } from '@/lib/composite/filters/context';
import { FailedFetchBanner } from '@/lib/primitives/banner/failed-fetch';
import { TableLoaderSkeleton } from '@/lib/primitives/loaders/table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DataTableContext } from '@/components/table/data-table-context';
import { DataTablePagination } from '@/components/table/data-table-pagination';

interface DataTableProps<TData, TValue> extends PropsWithChildren {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  count: number;
  initialVisibility?: VisibilityState;

  isLoading?: boolean;
  error?: PostgrestError;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  count,
  initialVisibility = {},
  isLoading = false,
  error,
  children,
}: DataTableProps<TData, TValue>) {
  const t = useTranslations('datatable');

  const filtersCtx = useFiltersCtx();

  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(initialVisibility);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const table = useReactTable({
    data,
    columns,
    state: {
      columnVisibility,
      rowSelection,
      columnFilters,
      sorting: filtersCtx.sorting,
      pagination: filtersCtx.pagination,
    },
    enableRowSelection: true,
    manualPagination: true,
    manualSorting: true,
    rowCount: count,
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: (updater) => {
      if (typeof updater === 'function') {
        filtersCtx.setPagination(updater(table.getState().pagination));
      }
    },
    onSortingChange: (updater) => {
      if (typeof updater === 'function') {
        filtersCtx.setSorting(updater(table.getState().sorting));
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  if (isLoading) {
    return <TableLoaderSkeleton />;
  }

  if (error) {
    return <FailedFetchBanner error={error} />;
  }

  return (
    <DataTableContext.Provider value={{ table }}>
      <div className="space-y-4">
        {children}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    {t('empty_message')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <DataTablePagination table={table} />
      </div>
    </DataTableContext.Provider>
  );
}
