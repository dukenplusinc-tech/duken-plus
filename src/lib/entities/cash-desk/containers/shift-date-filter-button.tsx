'use client';

import { FC, useState } from 'react';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import type { DateRange } from 'react-day-picker';

import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export interface ShiftDateFilterButtonProps {
  onDateChange?: (range: DateRange | undefined) => void;
}

export const ShiftDateFilterButton: FC<ShiftDateFilterButtonProps> = ({
  onDateChange,
}) => {
  const [range, setRange] = useState<DateRange>();

  const handleSelect = (selected?: DateRange) => {
    setRange(selected);
    onDateChange?.(selected);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={range?.from ? 'default' : 'outline'}
          size="icon"
          className={range?.from ? 'bg-primary hover:bg-primary/90 aspect-square' : 'border-2 border-primary/30 aspect-square'}
        >
          <Calendar className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <CalendarComponent
          mode="range"
          selected={range}
          onSelect={handleSelect}
          disabled={{ after: new Date() }}
        />
      </PopoverContent>
    </Popover>
  );
};






