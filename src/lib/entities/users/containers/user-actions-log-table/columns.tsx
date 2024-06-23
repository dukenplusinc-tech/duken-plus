'use client';

import { ColumnDef } from '@tanstack/react-table';

import { UserActionLog } from '@/lib/entities/users/schema';
import { Badge } from '@/components/ui/badge';
import { FormatDate } from '@/components/date/format-date';
import { DataTableColumnHeader } from '@/components/table/data-table-column-header';

export const columns: ColumnDef<UserActionLog>[] = [
  {
    accessorKey: 'action',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Action" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <Badge>{row.getValue('action')}</Badge>
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: 'entity',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Entity" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[250px] truncate font-medium">
            {row.getValue('entity')}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'entity_id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Entity ID" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[250px] truncate font-medium">
            {row.getValue('entity_id')}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'timestamp',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Datetime" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <FormatDate className="font-medium">
            {row.getValue('timestamp')}
          </FormatDate>
        </div>
      );
    },
  },
];
