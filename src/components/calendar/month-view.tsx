'use client';

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

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1; // Convert Sunday (0) to 6, Monday (1) to 0, etc.
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div
          key={`empty-${i}`}
          className="h-12 flex items-center justify-center text-gray-300"
        >
          {getDaysInMonth(year, month - 1) - firstDay + i + 1}
        </div>
      );
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const isToday =
        today.getDate() === i &&
        today.getMonth() === month &&
        today.getFullYear() === year;
      const isSelected =
        currentDate.getDate() === i &&
        currentDate.getMonth() === month &&
        currentDate.getFullYear() === year;

      days.push(
        <div
          key={i}
          onClick={() => onDateSelect(new Date(year, month, i))}
          className={`h-12 flex items-center justify-center cursor-pointer rounded-md transition-colors
            ${isSelected ? 'bg-primary text-primary-foreground font-bold' : ''}
            ${isToday && !isSelected ? 'bg-red-100 text-red-600 font-bold' : ''}
            ${!isToday && !isSelected ? 'hover:bg-gray-100' : ''}
          `}
        >
          {i}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="h-full overflow-y-auto px-3">
      <div className="space-y-6">
        {/* Current Month */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-bold text-primary mb-4 text-center">
              {monthNames[month]}
            </h3>

            {/* Day Headers */}
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

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">{renderCalendar()}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
