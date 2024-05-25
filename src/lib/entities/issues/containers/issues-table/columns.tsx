'use client';

import Link from 'next/link';
import { ColumnDef } from '@tanstack/react-table';

import { Issue } from '@/lib/entities/issues/schema';
import * as fromUrl from '@/lib/url/generator';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/table/data-table-column-header';

import { DataTableRowActions } from './data-table-row-actions';

export const columns: ColumnDef<Issue>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Issue ID" />
    ),
    cell: ({ row }) => (
      <div className="w-[300px] whitespace-nowrap">
        <Link href={fromUrl.toIssue(row.getValue('id'))}>
          {row.getValue('id')}
        </Link>
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue('title')}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Repoted At" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue('created_at')}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'country',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Country" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <Badge className="whitespace-nowrap">
            {row.original.country || '---'}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: 'device.os',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Operation System" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <Badge className="whitespace-nowrap">
            {row.original?.device?.os || '---'}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: 'url',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Dashboard" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.original?.url}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'dashboard',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Proxy URL" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.original?.dashboard}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'device.device_id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Device ID" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.original.device?.device_id}
          </span>
        </div>
      );
    },
    enableSorting: false,
    enableColumnFilter: false,
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
