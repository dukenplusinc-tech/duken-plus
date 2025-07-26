'use client';

import { useMemo } from 'react';

import { useCalendarDeliveries } from '@/lib/entities/deliveries/hooks/useCalendarDeliveries';
import { Card, CardContent } from '@/components/ui/card';

interface MonthViewProps {
  currentDate: Date;
  onDateSelect: (date: Date) => void;
}

export default function MonthView({
  currentDate,
  onDateSelect,
}: MonthViewProps) {
  const today = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const { data = [] } = useCalendarDeliveries(currentDate);

  const deliveriesByDay = useMemo(() => {
    const map = new Map<
      string,
      { due?: boolean; pending?: boolean; consignment?: boolean }
    >();

    (data || []).forEach((d) => {
      const date = d.expected_date;
      if (!date) return;
      const flags = map.get(date) ?? {};
      if (d.status === 'due') flags.due = true;
      if (d.status === 'pending') flags.pending = true;
      if (d.is_consignement) flags.consignment = true;
      map.set(date, flags);
    });

    return map;
  }, [data]);

  const monthNames = [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь',
  ];
  const dayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  const getDaysInMonth = (year: number, month: number) =>
    new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => {
    const first = new Date(year, month, 1).getDay();
    return first === 0 ? 6 : first - 1;
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const days = [];

    // Pad empty cells before first
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div
          key={`empty-${i}`}
          className="h-12 flex items-center justify-center text-gray-300"
        ></div>
      );
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const fullDate = new Date(year, month, i).toISOString().slice(0, 10);
      const info = deliveriesByDay.get(fullDate);
      const isToday =
        today.getFullYear() === year &&
        today.getMonth() === month &&
        today.getDate() === i;
      const isSelected =
        currentDate.getFullYear() === year &&
        currentDate.getMonth() === month &&
        currentDate.getDate() === i;

      const hasAny = info?.due || info?.pending || info?.consignment;

      days.push(
        <div
          key={i}
          onClick={() => onDateSelect(new Date(year, month, i))}
          className={`h-12 flex flex-col items-center justify-center cursor-pointer rounded-md transition-colors relative
            ${isSelected ? 'bg-primary text-primary-foreground font-bold' : ''}
            ${isToday && !isSelected ? 'bg-red-100 text-red-600 font-bold' : ''}
            ${!isToday && !isSelected ? 'hover:bg-gray-100' : ''}
          `}
        >
          <span>{i}</span>
          {hasAny && (
            <div className="absolute bottom-1 flex gap-1">
              {info?.due && <div className="w-2 h-2 rounded-full bg-red-500" />}
              {info?.pending && (
                <div className="w-2 h-2 rounded-full bg-green-500" />
              )}
              {info?.consignment && (
                <div className="w-2 h-2 rounded-full bg-yellow-500" />
              )}
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="h-full overflow-y-auto px-3">
      <div className="space-y-6">
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-bold text-primary mb-4 text-center">
              {monthNames[month]}
            </h3>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {dayNames.map((day) => (
                <div
                  key={day}
                  className="h-8 flex items-center justify-center text-sm font-medium text-muted-foreground"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">{renderCalendar()}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
