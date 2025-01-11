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
  SortingState,
} from '@/lib/composite/filters/context';

export const FiltersProvider: FC<PropsWithChildren> = ({ children }) => {
  const [filters, setFilters] = useState<ActiveFilter[]>([]);

  const [sorting, setSorting] = useState<SortingState>([]);

  const reset = useCallback(() => {
    setFilters([]);
    setSorting([]);
  }, []);

  const ref = useRef({ reset });

  const value: FiltersContextState = useMemo(() => {
    return {
      applied: filters,
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
  }, [filters, reset, sorting]);

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
