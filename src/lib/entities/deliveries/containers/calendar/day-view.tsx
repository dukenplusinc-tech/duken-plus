'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';

import { useCalendarDeliveries } from '@/lib/entities/deliveries/hooks/useCalendarDeliveries';
import { Card, CardContent } from '@/components/ui/card';

interface DayViewProps {
  currentDate: Date;
}

export default function DayView({ currentDate }: DayViewProps) {
  const { data = [] } = useCalendarDeliveries(currentDate);
  const t = useTranslations('calendar');

  const events = useMemo(() => {
    const dayISO = currentDate.toISOString().slice(0, 10);

    return (data || [])
      .filter((item) => item.expected_date === dayISO)
      .sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      )
      .map((item) => ({
        id: item.id,
        title: item.contractors?.title || t('no_title'),
        color:
          item.status === 'due'
            ? 'bg-red-200'
            : item.is_consignement
              ? 'bg-yellow-200'
              : 'bg-green-200',
      }));
  }, [data, currentDate, t]);

  const dayNames = t.raw('weekdays') as string[];
  const dayName = dayNames[currentDate.getDay()];
  const monthName = currentDate.toLocaleDateString('ru-RU', { month: 'long' });

  return (
    <div className="h-full overflow-y-auto px-3">
      <div className="mb-4">
        <h2 className="text-lg font-medium text-center text-primary">
          {dayName}, {currentDate.getDate()} {monthName}{' '}
          {currentDate.getFullYear()}
        </h2>
      </div>

      <div className="space-y-2">
        {events.length === 0 ? (
          <p className="text-muted-foreground text-center">{t('empty_text')}</p>
        ) : (
          events.map((event) => (
            <Card
              key={event.id}
              className={`${event.color} border-l-4 border-l-primary`}
            >
              <CardContent className="p-3">
                <div className="font-medium text-sm">{event.title}</div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
