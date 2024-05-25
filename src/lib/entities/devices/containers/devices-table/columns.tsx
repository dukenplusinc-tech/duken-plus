'use client';

import Link from 'next/link';
import { ColumnDef } from '@tanstack/react-table';

import type { Device } from '@/lib/entities/devices/schema';
import * as fromUrl from '@/lib/url/generator';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/table/data-table-column-header';

import { DataTableRowActions } from './data-table-row-actions';

export const columns: ColumnDef<Device>[] = [
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
    accessorKey: 'os',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Operation System" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <Badge className="whitespace-nowrap">
            {row.original?.os || '---'}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: 'Issues',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Reported Issues" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <Badge className="whitespace-nowrap">
            {row.original?.issuesCount || '0'}
          </Badge>
        </div>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
