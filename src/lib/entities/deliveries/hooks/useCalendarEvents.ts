import { useMemo } from 'react';

import {
  toYDM,
  ymdLocal,
} from '@/lib/entities/deliveries/containers/calendar/time-utils';
import {
  DeliveryWithContractor,
  useCalendarDeliveries,
} from '@/lib/entities/deliveries/hooks/useCalendarDeliveries';
import {
  CalendarExpense,
  useCalendarExpenses,
} from '@/lib/entities/expenses/hooks/useCalendarExpenses';

export type CalendarEvent =
  | {
      kind: 'delivery';
      id: string;
      title: string;
      subtitle?: string; // status text
      status: DeliveryWithContractor['status'];
      isConsignment: boolean;
      amount?: number | null;
      date: string; // YYYY-MM-DD
      createdAt: string;
    }
  | {
      kind: 'expense';
      id: string;
      title: string; // expense type
      amount: number;
      date: string; // YYYY-MM-DD
      createdAt: string;
    };

export type DayFlags = {
  due?: boolean;
  pending?: boolean;
  accepted?: boolean;
  consignment?: boolean;
  hasExpense?: boolean;
};

export function useCalendarEvents(currentDate: Date) {
  const { data: deliveriesRaw = [], ...deliveriesRest } =
    useCalendarDeliveries(currentDate);
  const { data: expensesRaw = [], ...expensesRest } =
    useCalendarExpenses(currentDate);

  const events = useMemo<CalendarEvent[]>(() => {
    const dels: CalendarEvent[] = (deliveriesRaw ?? []).map((d) => ({
      kind: 'delivery',
      id: d.id,
      title: d.contractors?.title || '—',
      subtitle: d.status, // we’ll localize where we render
      status: d.status,
      isConsignment: Boolean(
        (d as any).is_consignement || (d as any).is_consignment
      ),
      amount: (d.amount_received as any) ?? (d.amount_expected as any),
      date: toYDM(d.expected_date),
      createdAt: (d.created_at as any)?.toString() ?? '',
    }));

    const exps: CalendarEvent[] = (expensesRaw ?? []).map(
      (e: CalendarExpense) => {
        return {
          kind: 'expense',
          id: e.id,
          title: e.type,
          amount: e.amount,
          date: toYDM(e.date),
          createdAt: e.created_at,
        };
      }
    );

    // Stable order: by createdAt to match your previous behavior
    return [...dels, ...exps].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }, [deliveriesRaw, expensesRaw]);

  const flagsByDay = useMemo<Map<string, DayFlags>>(() => {
    const map = new Map<string, DayFlags>();
    for (const ev of events) {
      const key = ev.date;
      if (!key) continue;
      const f = map.get(key) ?? {};
      if (ev.kind === 'expense') {
        f.hasExpense = true;
      } else {
        if (ev.status === 'due') f.due = true;
        if (ev.status === 'pending') f.pending = true;
        if (ev.status === 'accepted') f.accepted = true;
        if (ev.isConsignment) f.consignment = true;
      }
      map.set(key, f);
    }
    return map;
  }, [events]);

  // For DayView convenience: pre-filter by the provided date
  const dayKey = ymdLocal(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate()
  );

  const eventsForDay = useMemo(
    () => events.filter((e) => e.date === dayKey),
    [events, dayKey]
  );

  return {
    data: events,
    eventsForDay,
    flagsByDay,
    // bubble up loading / error
    isLoading:
      (deliveriesRest as any).isLoading || (expensesRest as any).isLoading,
    error: (deliveriesRest as any).error || (expensesRest as any).error,
  };
}
