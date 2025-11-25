'use client';

import { useEffect, useMemo, useState } from 'react';

import { useFiltersCtx } from '@/lib/composite/filters/context';
import { createClient } from '@/lib/supabase/client';

type DeliveryStatus = 'pending' | 'accepted' | 'due' | 'canceled';

interface DeliveryRow {
  id: string;
  contractor_id: string | null;
  status: DeliveryStatus;
  is_consignement: boolean;
  consignment_status: 'open' | 'closed' | null;
  consignment_due_date: string | null;
  expected_date: string;
  accepted_date: string | null;
  amount_expected: number | null;
  amount_received: number | null;
}

interface ExpenseRow {
  id: string;
  type: string | null;
  amount: number | null;
  date: string;
}

interface ContractorRow {
  id: string;
  title: string;
}

export interface DailyDelivery extends DeliveryRow {
  contractor_title: string;
}

export interface DailyExpense {
  id: string;
  type: string;
  amount: number;
  date: string;
}

export interface DayBreakdown {
  date: string;
  expensesTotal: number;
  deliveriesAmountTotal: number;
  deliveriesCount: number;
  accepted: DailyDelivery[];
  others: DailyDelivery[];
  consignments: DailyDelivery[];
  expenses: DailyExpense[];
}

export interface DailyStatsResult {
  days: DayBreakdown[];
  totals: {
    expenses: number;
    deliveriesAmount: number;
  };
}

function toISODate(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getMonthRange(anchor: Date) {
  const start = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
  const endExclusive = new Date(anchor.getFullYear(), anchor.getMonth() + 1, 1);

  return {
    from: toISODate(start),
    to: toISODate(new Date(endExclusive.getTime() - 1)),
    toExclusive: toISODate(endExclusive),
  };
}

export function useDailyStats(monthAnchor: Date) {
  const [{ days, totals }, setData] = useState<DailyStatsResult>({
    days: [],
    totals: { expenses: 0, deliveriesAmount: 0 },
  });
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get sorting from filters context
  const { sorting } = useFiltersCtx();

  const { from, to, toExclusive } = useMemo(
    () => getMonthRange(monthAnchor),
    [monthAnchor]
  );

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const supabase = createClient();
      setLoading(true);
      setError(null);

      const { data: deliveriesRows, error: deliveriesError } = await supabase
        .from('deliveries')
        .select(
          'id,contractor_id,status,is_consignement,consignment_status,consignment_due_date,expected_date,accepted_date,amount_expected,amount_received'
        )
        .gte('expected_date', from)
        .lt('expected_date', toExclusive)
        .order('expected_date', { ascending: false });

      if (deliveriesError) {
        if (!cancelled) {
          setError(deliveriesError.message);
          setLoading(false);
        }
        return;
      }

      const deliveryRows = (deliveriesRows ?? []) as DeliveryRow[];

      const contractorIds = Array.from(
        new Set(
          deliveryRows
            .map((r) => r.contractor_id)
            .filter((id): id is string => Boolean(id))
        )
      );

      let contractorMap = new Map<string, string>();
      if (contractorIds.length) {
        const { data: contractors, error: contractorError } = await supabase
          .from('contractors')
          .select('id,title')
          .in('id', contractorIds);

        if (!contractorError) {
          contractorMap = new Map(
            (contractors as ContractorRow[]).map((c) => [c.id, c.title])
          );
        }
      }

      const ensureTitle = (id: string | null) =>
        id ? contractorMap.get(id) ?? '—' : '—';

      const byDay = new Map<string, DayBreakdown>();
      const ensureDay = (dateISO: string): DayBreakdown => {
        const existing = byDay.get(dateISO);
        if (existing) return existing;
        const next: DayBreakdown = {
          date: dateISO,
          expensesTotal: 0,
          deliveriesAmountTotal: 0,
          deliveriesCount: 0,
          accepted: [],
          others: [],
          consignments: [],
          expenses: [],
        };
        byDay.set(dateISO, next);
        return next;
      };

      let monthDeliveriesAmount = 0;

      deliveryRows.forEach((row) => {
        const day = row.expected_date?.slice(0, 10);
        if (!day) return;

        const breakdown = ensureDay(day);
        const enriched: DailyDelivery = {
          ...row,
          contractor_title: ensureTitle(row.contractor_id),
        };

        breakdown.deliveriesCount += 1;
        const amount =
          Number(row.amount_received ?? 0) || Number(row.amount_expected ?? 0);
        breakdown.deliveriesAmountTotal += amount;
        monthDeliveriesAmount += amount;

        if (row.status === 'accepted') {
          breakdown.accepted.push(enriched);
        } else {
          breakdown.others.push(enriched);
        }

        if (row.is_consignement && row.consignment_status === 'open') {
          breakdown.consignments.push(enriched);
        }
      });

      const { data: expensesRows, error: expensesError } = await supabase
        .from('expenses')
        .select('id,type,amount,date')
        .gte('date', from)
        .lt('date', toExclusive)
        .order('date', { ascending: false });

      if (expensesError) {
        if (!cancelled) {
          setError(expensesError.message);
          setLoading(false);
        }
        return;
      }

      let monthExpenses = 0;
      (expensesRows ?? []).forEach((row) => {
        const item = row as ExpenseRow;
        const day = item.date?.slice(0, 10);
        if (!day) return;

        const breakdown = ensureDay(day);
        const amount = Number(item.amount ?? 0);
        const expense: DailyExpense = {
          id: item.id,
          type: (item.type ?? '—').trim() || '—',
          amount,
          date: day,
        };

        breakdown.expenses.push(expense);
        breakdown.expensesTotal += amount;
        monthExpenses += amount;
      });

      if (!cancelled) {
        // Apply sorting from context
        const sortedDays = Array.from(byDay.values()).sort((a, b) => {
          // Get the first sort option from context
          const sortOption = sorting[0];

          if (!sortOption) {
            // Default: sort by date descending
            return a.date < b.date ? 1 : -1;
          }

          const { id: sortBy, desc } = sortOption;

          let comparison = 0;

          if (sortBy === 'date') {
            comparison = a.date < b.date ? -1 : a.date > b.date ? 1 : 0;
          } else if (sortBy === 'amount') {
            comparison = a.expensesTotal - b.expensesTotal;
          }

          return desc ? -comparison : comparison;
        });

        setData({
          days: sortedDays,
          totals: {
            expenses: monthExpenses,
            deliveriesAmount: monthDeliveriesAmount,
          },
        });
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [from, toExclusive, sorting]);

  return {
    days,
    totals,
    isLoading,
    error,
    range: { from, to },
  };
}
