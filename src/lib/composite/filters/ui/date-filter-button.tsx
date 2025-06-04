'use client'

import { FC, useState } from 'react'
import { CalendarRange } from 'lucide-react'
import { format } from 'date-fns'
import type { DateRange } from 'react-day-picker'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useFiltersCtx } from '@/lib/composite/filters/context'

export interface DateFilterButtonProps {
  disableFutureDates?: boolean
}

export const DateFilterButton: FC<DateFilterButtonProps> = ({
  disableFutureDates = true,
}) => {
  const { setFilters, removeFilter } = useFiltersCtx()
  const [range, setRange] = useState<DateRange>()

  const handleSelect = (selected?: DateRange) => {
    setRange(selected)
    if (selected?.from) {
      const start = format(selected.from, 'yyyy-MM-dd')
      const endDate = selected.to ?? selected.from
      const end = format(endDate, 'yyyy-MM-dd 23:59:59')
      setFilters((prev) => [
        ...prev.filter((f) => f.key !== 'date'),
        { key: 'date', gte: start },
        { key: 'date', lte: end },
      ])
    } else {
      removeFilter('date')
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={range?.from ? 'default' : 'outline'}
          size="icon"
          className={range?.from ? 'bg-primary hover:bg-primary/90 aspect-square' : 'border-2 border-primary/30 aspect-square'}
        >
          <CalendarRange className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <Calendar
          mode="range"
          selected={range}
          onSelect={handleSelect}
          disabled={disableFutureDates ? { after: new Date() } : undefined}
        />
      </PopoverContent>
    </Popover>
  )
}
