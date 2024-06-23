'use client';

import { useCallback, useMemo } from 'react';
import { TrashIcon } from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';

import type { ConfirmDeletePopUp } from '@/lib/primitives/dialog/confirm/delete';
import { Button } from '@/components/ui/button';
import { SmallSpinner } from '@/components/spinner/small';

interface DataTableDeleteButton<TData> extends ConfirmDeletePopUp {
  table: Table<TData>;
}

export function DataTableDeleteButton<TData>({
  table,
  onDelete,
  processing,
}: DataTableDeleteButton<TData>) {
  const isSelected =
    table.getIsSomeRowsSelected() || table.getIsAllPageRowsSelected();
  const selected = table.getSelectedRowModel();

  const ids = useMemo(() => {
    return selected.rows.map((row) => row.getValue('id') as string);
  }, [selected]);

  const handleDelete = useCallback(() => {
    if (onDelete) {
      onDelete(ids);
    }
  }, [ids, onDelete]);

  if (isSelected) {
    return (
      <Button
        variant="destructive"
        className="h-8 px-2 lg:px-3"
        onClick={handleDelete}
        disabled={processing}
      >
        {processing && <SmallSpinner className="mr-2" />}
        Delete selected ({table.getSelectedRowModel().flatRows.length})
        <TrashIcon className="ml-2 h-4 w-4" />
      </Button>
    );
  }

  return null;
}
