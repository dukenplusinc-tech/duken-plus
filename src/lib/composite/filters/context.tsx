import { createContext, Dispatch, SetStateAction, useContext } from 'react';

type SetState<T> = Dispatch<SetStateAction<T>>;

export type ActiveFilter = {
  key: string;
  in?: (string | number)[];
  search?: string;
  like?: string;
  eq?: string | boolean;
  neq?: string;
  gte?: string | Date;
  lte?: string | Date;
};

export interface ColumnSort {
  desc: boolean;
  id: string;
}

export type SortingState = ColumnSort[];

export interface FiltersContextState {
  applied: ActiveFilter[];
  sorting: SortingState;
  setFilters: (
    filters: ActiveFilter[] | SetStateAction<ActiveFilter[]>
  ) => void;
  setInValues: (key: string, values: string[] | undefined) => void;
  setSorting: SetState<SortingState>;
  removeFilter: (key: string) => void;
  reset: () => void;
}

export const FiltersContext = createContext<FiltersContextState | null>(null);

export const useFiltersCtx = () => {
  return useContext(FiltersContext)!;
};
