import { createContext, useContext } from 'react';
import { RowData, Table } from '@tanstack/react-table';

export interface DataTableCtx<TData extends RowData> {
  table: Table<TData> | null;
}

export const DataTableContext = createContext<DataTableCtx<any>>({
  table: null,
});

export function useDataTableCtx<TData extends RowData>() {
  return useContext(DataTableContext) as DataTableCtx<TData>;
}

export function useDataTable<TData extends RowData>() {
  const { table } = useDataTableCtx<TData>();

  return table!;
}
