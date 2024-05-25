'use client';

import {
  FC,
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  ActiveFilter,
  FiltersContext,
  FiltersContextState,
  Pagination,
  SortingState,
} from '@/lib/composite/filters/context';

const initialPagination = {
  pageIndex: 0,
  pageSize: 30,
};

export const FiltersProvider: FC<PropsWithChildren> = ({ children }) => {
  const [filters, setFilters] = useState<ActiveFilter[]>([]);
  const [pagination, setPagination] = useState<Pagination>(initialPagination);

  const [sorting, setSorting] = useState<SortingState>([]);

  const reset = useCallback(() => {
    setFilters([]);
    setSorting([]);
    setPagination(initialPagination);
  }, []);

  const ref = useRef({ reset });

  const value: FiltersContextState = useMemo(() => {
    return {
      applied: filters,
      pagination,
      setPagination,
      sorting,
      setSorting,
      setFilters,
      reset,
      removeFilter: (removeKey) => {
        setFilters((prevState) =>
          prevState.filter(({ key }) => {
            return key !== removeKey;
          })
        );
      },
      setInValues(key: string, values: string[] | undefined) {
        setFilters((prevState: ActiveFilter[]) => {
          const items = prevState.filter((f) => f.key !== key);

          if (!values) {
            return items;
          }

          return [
            ...items,
            {
              key,
              in: values,
            },
          ];
        });
      },
    };
  }, [filters, pagination, reset, sorting]);

  // clear filters on router change
  useEffect(() => {
    const reset = ref.current.reset;

    return () => {
      reset();
    };
  }, []);

  return (
    <FiltersContext.Provider value={value}>{children}</FiltersContext.Provider>
  );
};
