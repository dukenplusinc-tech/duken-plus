'use client';

import { useMemo } from 'react';

import { useCalendarDeliveries } from '@/lib/entities/deliveries/hooks/useCalendarDeliveries';
import { Card, CardContent } from '@/components/ui/card';

interface DayViewProps {
  currentDate: Date;
}

export default function DayView({ currentDate }: DayViewProps) {
  const { data = [] } = useCalendarDeliveries(currentDate);

  const events = useMemo(() => {
    const dayISO = currentDate.toISOString().slice(0, 10);

    return (data || [])
      .filter((item) => item.expected_date === dayISO)
      .map((item) => {
        const time = item.expected_time ?? '10:00'; // fallback time
        const hour = parseInt(time.split(':')[0] || '10', 10);

        return {
          id: item.id,
          title: item.contractors?.title || 'Без названия',
          time,
          hour,
          duration: 60,
          color:
            item.status === 'due'
              ? 'bg-red-200'
              : item.is_consignement
                ? 'bg-yellow-200'
                : 'bg-green-200',
        };
      });
  }, [data, currentDate]);

  const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 08:00 to 19:00
  const dayNames = [
    'Воскресенье',
    'Понедельник',
    'Вторник',
    'Среда',
    'Четверг',
    'Пятница',
    'Суббота',
  ];
  const dayName = dayNames[currentDate.getDay()];

  return (
    <div className="h-full overflow-y-auto px-3">
      <div className="mb-4">
        <h2 className="text-lg font-medium text-center text-primary">
          {dayName}, {currentDate.getDate()}{' '}
          {currentDate.toLocaleDateString('ru-RU', { month: 'long' })}{' '}
          {currentDate.getFullYear()}
        </h2>
      </div>

      <div className="space-y-1">
        {hours.map((hour) => {
          const hourEvents = events.filter((e) => e.hour === hour);

          return (
            <div key={hour} className="flex">
              <div className="w-16 flex-shrink-0 text-right pr-3 py-2">
                <span className="text-sm text-muted-foreground">{hour}:00</span>
              </div>
              <div className="flex-1 min-h-[60px] border-l border-gray-200 pl-3 relative">
                {hourEvents.length > 0 ? (
                  hourEvents.map((event) => (
                    <Card
                      key={event.id}
                      className={`${event.color} border-l-4 border-l-primary mb-2`}
                    >
                      <CardContent className="p-3">
                        <div className="font-medium text-sm">{event.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {event.time}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="h-full border-b border-gray-100"></div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
