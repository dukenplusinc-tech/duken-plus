'use client';

import { useEffect, useState } from 'react';
import { Cross2Icon } from '@radix-ui/react-icons';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDataTable } from '@/components/table/data-table-context';

interface DataTableToolbarProps<TData> {
  filterByColumn?: string;
}

export function DataTableSearchBy<TData>({
  filterByColumn = 'title',
}: DataTableToolbarProps<TData>) {
  const t = useTranslations('datatable');

  const table = useDataTable<TData>();

  const [searchQuery, setSearchQuery] = useState(
    (table.getColumn(filterByColumn)?.getFilterValue() as string) ?? ''
  );

  useEffect(() => {
    table.getColumn(filterByColumn)?.setFilterValue(searchQuery);
  }, [filterByColumn, searchQuery, table]);

  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex flex-1 items-center space-x-2">
      <Input
        placeholder={t('filter_placeholder')}
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
        className="h-8 w-[150px] lg:w-[250px]"
      />

      {isFiltered && (
        <Button
          variant="ghost"
          onClick={() => {
            table.resetColumnFilters();
            setSearchQuery('');
          }}
          className="h-8 px-2 lg:px-3"
        >
          Reset
          <Cross2Icon className="ml-2 h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
