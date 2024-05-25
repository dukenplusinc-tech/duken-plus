import { createContext, SetStateAction, useContext, useMemo } from 'react';

export type ActiveFilter = {
  key: string;
  in?: (string | number)[];
  eq?: string;
  gte?: string | Date;
  lte?: string | Date;
};

export type Pagination = {
  pageSize: number;
  pageIndex: number;
};

export interface ColumnSort {
  desc: boolean;
  id: string;
}

export type SortingState = ColumnSort[];

export interface FiltersContextState {
  applied: ActiveFilter[];
  pagination: Pagination;
  sorting: SortingState;
  setFilters: (
    filters: ActiveFilter[] | SetStateAction<ActiveFilter[]>
  ) => void;
  setInValues: (key: string, values: string[] | undefined) => void;
  setPagination: (pagination: Pagination) => void;
  setSorting: (sorting: SortingState) => void;
  removeFilter: (key: string) => void;
}

export const FiltersContext = createContext<FiltersContextState | null>(null);

export const useFiltersCtx = () => {
  return useContext(FiltersContext)!;
};

export const useFilter = (key: string) => {
  const { applied, setInValues: ctxSetInValues } = useFiltersCtx();

  return useMemo(() => {
    const filter = applied.find((f) => f.key === key) || null;

    return {
      filter,
      selectedInValues: new Set((filter?.in || []) as string[]),
      setInValues(values: string[] | undefined) {
        ctxSetInValues(key, values);
      },
    };
  }, [applied, ctxSetInValues, key]);
};
