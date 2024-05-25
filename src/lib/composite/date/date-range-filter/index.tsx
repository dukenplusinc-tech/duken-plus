'use client';

import { FC, useCallback, useEffect, useRef } from 'react';

import { ActiveFilter, useFiltersCtx } from '@/lib/composite/filters/context';
import { toSupabaseDateString } from '@/lib/supabase/date/format';
import {
  CalendarDateRangePicker,
  DateRange,
} from '@/components/date-range-picker';

export const DateRangeFilter: FC = () => {
  const { setFilters } = useFiltersCtx();

  const emit = useCallback(
    (range: DateRange | undefined) => {
      const filter: ActiveFilter = {
        key: 'created_at',
      };

      if (range?.from) {
        filter.gte = toSupabaseDateString(range?.from);
      }

      if (range?.to) {
        filter.lte = toSupabaseDateString(range?.to);
      }

      setFilters([filter]);
    },
    [setFilters]
  );

  const ref = useRef({
    emit,
  });

  useEffect(() => {
    ref.current.emit = emit;
  }, [emit]);

  const onSelect = useCallback((range?: DateRange) => {
    ref.current.emit(range);
  }, []);

  return (
    <div className="flex items-center space-x-2">
      <CalendarDateRangePicker onSelect={onSelect} />
    </div>
  );
};
