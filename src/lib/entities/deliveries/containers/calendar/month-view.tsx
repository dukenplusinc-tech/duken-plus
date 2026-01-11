'use client';

import { useTranslations } from 'next-intl';

import { ymdLocal } from '@/lib/entities/deliveries/containers/calendar/time-utils';
import { useCalendarEvents } from '@/lib/entities/deliveries/hooks/useCalendarEvents';
import { useSafeTranslations } from '@/lib/hooks/use-safe-translations';
import { Card, CardContent } from '@/components/ui/card';

interface MonthViewProps {
  currentDate: Date;
  onDateSelect: (date: Date) => void;
}

export default function MonthView({
  currentDate,
  onDateSelect,
}: MonthViewProps) {
  const t = useTranslations('calendar');
  const { safe } = useSafeTranslations('statistics.delivery');

  const today = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const { flagsByDay } = useCalendarEvents(currentDate);

  const monthNames = t.raw('months') as string[];
  const dayNames = t.raw('day_names') as string[];

  const getDaysInMonth = (y: number, m: number) =>
    new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y: number, m: number) => {
    const first = new Date(y, m, 1).getDay();
    return first === 0 ? 6 : first - 1;
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const days: JSX.Element[] = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div
          key={`empty-${i}`}
          className="h-12 flex items-center justify-center text-gray-300"
        />
      );
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const fullDate = ymdLocal(year, month, i);
      const info = flagsByDay.get(fullDate);
      const isToday =
        today.getFullYear() === year &&
        today.getMonth() === month &&
        today.getDate() === i;
      const isSelected =
        currentDate.getFullYear() === year &&
        currentDate.getMonth() === month &&
        currentDate.getDate() === i;

      const hasAny =
        info?.due ||
        info?.pending ||
        info?.accepted ||
        info?.consignment ||
        info?.hasExpense;

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
              {/* delivery states */}
              {info?.due && (
                <div
                  className="w-2 h-2 rounded-full bg-red-500"
                  title={safe('status.due')}
                />
              )}
              {info?.pending && (
                <div
                  className="w-2 h-2 rounded-full bg-orange-500"
                  title={safe('status.pending')}
                />
              )}
              {info?.accepted && (
                <div
                  className="w-2 h-2 rounded-full bg-green-500"
                  title={safe('status.accepted')}
                />
              )}
              {info?.consignment && (
                <div
                  className="w-2 h-2 rounded-full bg-yellow-500"
                  title={t('consignment')}
                />
              )}
              {/* expenses */}
              {info?.hasExpense && (
                <div
                  className="w-2 h-2 rounded-full bg-blue-600"
                  title={t('expense')}
                />
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

            {/* Legend */}
            <div className="mt-6 pt-4 border-t">
              <h4 className="text-sm font-semibold text-muted-foreground mb-3">
                {t('legend_title')}
              </h4>
              <div className="grid grid-cols-1 gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500 flex-shrink-0" />
                  <span className="text-sm">{safe('status.due')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500 flex-shrink-0" />
                  <span className="text-sm">{safe('status.pending')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500 flex-shrink-0" />
                  <span className="text-sm">{safe('status.accepted')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500 flex-shrink-0" />
                  <span className="text-sm">{t('consignment')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-600 flex-shrink-0" />
                  <span className="text-sm">{t('expense')}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
