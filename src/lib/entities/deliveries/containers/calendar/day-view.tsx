'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';

import { ymdLocal } from '@/lib/entities/deliveries/containers/calendar/time-utils';
import { useCalendarDeliveries } from '@/lib/entities/deliveries/hooks/useCalendarDeliveries';
import { Card, CardContent } from '@/components/ui/card';
import { Money } from '@/components/numbers/money';

interface DayViewProps {
  currentDate: Date;
}

export default function DayView({ currentDate }: DayViewProps) {
  const { data = [] } = useCalendarDeliveries(currentDate);

  const t = useTranslations('calendar');

  const events = useMemo(() => {
    // Local YYYY-MM-DD for the current date
    const dayKey = ymdLocal(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate()
    );

    return (data || [])
      .filter((item) => {
        if (!item.expected_date) return false;
        // normalize to first 10 chars → "YYYY-MM-DD"
        const key = item.expected_date.slice(0, 10);
        return key === dayKey;
      })
      .sort((a, b) => {
        const ta = a.created_at ? new Date(a.created_at).getTime() : 0;
        const tb = b.created_at ? new Date(b.created_at).getTime() : 0;

        return ta - tb;
      })
      .map((item) => {
        let color = 'bg-green-200';

        if (item.status === 'due') {
          color = 'bg-red-200';
        } else if (item.is_consignement) {
          color = 'bg-yellow-200';
        } else if (item.status === 'accepted') {
          color = 'bg-orange-200';
        }

        return {
          id: item.id,
          title: item.contractors?.title || t('no_title'),
          color,
          amount: item.amount_received || item.amount_expected,
        };
      });
  }, [data, currentDate, t]);

  const dayNames = t.raw('weekdays') as string[];
  const jsDay = currentDate.getDay(); // 0 = Sunday … 6 = Saturday
  // If your `weekdays` starts with Monday, shift:
  const dayName = dayNames[(jsDay + 6) % 7];

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
              <CardContent className="flex flex-row justify-between p-3">
                <div className="font-medium text-sm">{event.title}</div>
                <div className="font-medium text-sm">
                  <Money>{event.amount}</Money>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
