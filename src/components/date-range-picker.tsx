'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { CalendarIcon } from '@radix-ui/react-icons';
import { format, subDays } from 'date-fns';
import type { DateRange } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

function getDefaultDateRange(): DateRange {
  const now = new Date();

  return {
    from: subDays(now, 30),
    to: now,
  };
}

interface CalendarDateRangePickerProps {
  onSelect?: (range: DateRange | undefined) => void;
  className?: string;
}

export { DateRange };

export function CalendarDateRangePicker({
  className,
  onSelect,
}: CalendarDateRangePickerProps) {
  const [date, setDate] = useState<DateRange | undefined>(getDefaultDateRange);

  const handleDataChoose = useCallback(() => {
    if (onSelect) {
      onSelect(date);
    }
  }, [date, onSelect]);

  const handleOpenChange = useCallback(
    (isOpen: boolean) => {
      if (!isOpen) {
        handleDataChoose();
      }
    },
    [handleDataChoose]
  );

  const ref = useRef({ handleDataChoose });

  // emit data-range on init
  useEffect(() => {
    ref.current.handleDataChoose();
  }, []);

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button
            variant={'outline'}
            className={cn(
              'w-[260px] justify-start text-left font-normal',
              !date && 'text-muted-foreground'
            )}
            onClick={handleDataChoose}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, 'LLL dd, y')} -{' '}
                  {format(date.to, 'LLL dd, y')}
                </>
              ) : (
                format(date.from, 'LLL dd, y')
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            toDate={new Date()}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
