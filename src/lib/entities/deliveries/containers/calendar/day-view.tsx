'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';

import { useCalendarEvents } from '@/lib/entities/deliveries/hooks/useCalendarEvents';
import { useSafeTranslations } from '@/lib/hooks/use-safe-translations';
import { Card, CardContent } from '@/components/ui/card';
import { Money } from '@/components/numbers/money';

interface DayViewProps {
  currentDate: Date;
}

export default function DayView({ currentDate }: DayViewProps) {
  const t = useTranslations('calendar');
  const { safe } = useSafeTranslations('statistics.delivery');

  const { eventsForDay } = useCalendarEvents(currentDate);

  // Color logic per event kind / status
  const items = useMemo(() => {
    return eventsForDay.map((ev) => {
      if (ev.kind === 'expense') {
        return {
          key: `exp-${ev.id}`,
          title: ev.title || t('no_title'),
          subtitle: t('expense'), // add key "expense" to your calendar messages
          color: 'bg-blue-200',
          amount: ev.amount ?? 0,
        };
      }
      // delivery
      let color = 'bg-orange-200'; // pending (waiting for acceptance)
      if (ev.status === 'due') color = 'bg-red-200';
      else if (ev.isConsignment) color = 'bg-yellow-200';
      else if (ev.status === 'accepted') color = 'bg-green-200';

      // Optional localization map: add keys calendar.status.pending/accepted/due/canceled
      const statusText = safe('status.' + ev.status) ?? ev.status;

      return {
        key: `del-${ev.id}`,
        title: ev.title || t('no_title'),
        subtitle: statusText,
        color,
        amount: ev.amount ?? null,
      };
    });
  }, [eventsForDay, safe, t]);

  const totalAmount = useMemo(() => {
    return items.reduce((acc, item) => {
      return acc + (typeof item.amount === 'number' ? item.amount : 0);
    }, 0);
  }, [items]);

  const dayName = useMemo(() => {
    const dayNames = t.raw('weekdays') as string[];
    const jsDay = currentDate.getDay(); // 0..6
    return dayNames[(jsDay + 6) % 7]; // shift if your array starts Monday
  }, [currentDate, t]);

  const monthName = currentDate.toLocaleDateString('ru-RU', { month: 'long' });

  return (
    <div className="h-full overflow-y-auto px-3">
      <div className="mt-2 mb-4">
        <h2 className="text-lg font-medium text-center text-primary">
          {dayName}, {currentDate.getDate()} {monthName}{' '}
          {currentDate.getFullYear()}
        </h2>
      </div>

      <div className="space-y-2">
        {items.length === 0 ? (
          <p className="text-muted-foreground text-center">{t('empty_text')}</p>
        ) : (
          items.map((ev) => (
            <Card
              key={ev.key}
              className={`${ev.color} border-l-4 border-l-primary`}
            >
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="font-medium text-sm">{ev.title}</div>
                  {ev.amount !== null && (
                    <div className="font-medium text-sm">
                      <Money>{ev.amount}</Money>
                    </div>
                  )}
                </div>
                {/* status / subtitle */}
                {ev.subtitle && (
                  <div className="mt-1 text-xs text-muted-foreground leading-none">
                    {ev.subtitle}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <div className="mt-8 rounded-md border bg-muted/40 p-3 flex items-center justify-between text-sm font-medium">
        <span>{t('total_label')}</span>
        <Money>{totalAmount}</Money>
      </div>
    </div>
  );
}
