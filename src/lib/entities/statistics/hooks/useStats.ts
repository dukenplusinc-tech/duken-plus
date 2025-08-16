'use client';

import { useEffect, useMemo, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

export type Period = 'day' | 'week' | 'month' | 'year';
export type DeliveryStatus = 'pending' | 'accepted' | 'due' | 'canceled';

export interface DeliveriesSummary {
  total: number;
  accepted: number;
  pending: number;
  due: number;
  canceled: number;
  acceptanceRate: number;
  onTimeRate: number;
  consignmentsOpen: number;
  consignmentsOverdue: number;
  amountExpected: number;
  amountReceived: number;
}

export interface TrendDay {
  day: string; // YYYY-MM-DD
  accepted: number;
  pending: number;
  due: number;
  canceled: number;
}

export interface CompanyRow {
  contractor_id: string;
  contractor_title: string;
  total_deliveries: number;
  accepted: number;
  acceptanceRate: number;
  consignments_open: number;
  consignments_overdue: number;
  amount_expected_total: number;
  amount_received_total: number;
  last_delivery_date: string | null;
}

export interface AttentionItem {
  id: string;
  type: 'delivery_due_today' | 'delivery_overdue' | 'consignment_overdue';
  title: string;
  subtitle?: string;
  expected_date?: string | null;
  consignment_due_date?: string | null;
  contractor_id?: string | null;
}

export interface OverdueDelivery {
  id: string;
  contractor_id: string | null;
  contractor_title: string;
  expected_date: string; // YYYY-MM-DD
  days_overdue: number;
  status: 'pending' | 'due';
  amount_expected: number;
  amount_received: number;
}

export interface ShopStats {
  deliveries: DeliveriesSummary;
  trend: TrendDay[];
  companies: CompanyRow[];
  attention: AttentionItem[];
  overdueDeliveries: OverdueDelivery[]; // ⬅️ новое поле
}

type DeliveryRow = {
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
};

type ContractorRow = { id: string; title: string };

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
function toISODate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
function getRange(period: Period) {
  const to = startOfDay(new Date());
  const from = new Date(to);
  if (period === 'day') from.setDate(from.getDate() - 0);
  if (period === 'week') from.setDate(from.getDate() - 6);
  if (period === 'month') from.setMonth(from.getMonth() - 1);
  if (period === 'year') from.setFullYear(from.getFullYear() - 1);
  return { from: toISODate(from), to: toISODate(to) };
}
function isBeforeOrEqualISO(aISO: string, bISO: string) {
  return aISO <= bISO;
}

export function useShopStats(period: Period) {
  const [data, setData] = useState<ShopStats | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { from, to } = useMemo(() => getRange(period), [period]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);

      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      // 1) Deliveries за период
      const { data: deliveries, error: dErr } = await supabase
        .from('deliveries')
        .select(
          'id,contractor_id,status,is_consignement,consignment_status,consignment_due_date,expected_date,accepted_date,amount_expected,amount_received'
        )
        .gte('expected_date', from)
        .lte('expected_date', to);

      if (dErr) {
        if (!cancelled) {
          setError(dErr.message);
          setLoading(false);
        }
        return;
      }

      const rows = (deliveries ?? []) as DeliveryRow[];

      // 2) Агрегации + тренд
      const byDay = new Map<string, TrendDay>();
      let total = 0,
        accepted = 0,
        pending = 0,
        due = 0,
        canceled = 0;
      let acceptedOnTime = 0;
      let consignmentsOpen = 0,
        consignmentsOverdue = 0;
      let amountExpected = 0,
        amountReceived = 0;

      const todayISO = toISODate(startOfDay(new Date()));

      // просрочки (для отдельного блока)
      const overdueList: OverdueDelivery[] = [];

      rows.forEach((r) => {
        const day = r.expected_date?.slice(0, 10);
        if (!day) return;

        const d = byDay.get(day) ?? {
          day,
          accepted: 0,
          pending: 0,
          due: 0,
          canceled: 0,
        };
        d[r.status] += 1;
        byDay.set(day, d);

        total += 1;
        if (r.status === 'accepted') accepted += 1;
        if (r.status === 'pending') pending += 1;
        if (r.status === 'due') due += 1;
        if (r.status === 'canceled') canceled += 1;

        // On-time acceptance
        if (r.status === 'accepted' && r.accepted_date && r.expected_date) {
          if (
            isBeforeOrEqualISO(
              r.accepted_date.slice(0, 10),
              r.expected_date.slice(0, 10)
            )
          ) {
            acceptedOnTime += 1;
          }
        }

        // Consignments
        if (r.is_consignement && r.consignment_status === 'open') {
          consignmentsOpen += 1;
          if (
            r.consignment_due_date &&
            r.consignment_due_date.slice(0, 10) < todayISO
          ) {
            consignmentsOverdue += 1;
          }
        }

        // Amounts
        amountExpected += Number(r.amount_expected ?? 0);
        amountReceived += Number(r.amount_received ?? 0);

        // Overdue deliveries list
        const expISO = r.expected_date?.slice(0, 10);
        if (expISO) {
          const isOverdue =
            r.status === 'due' || (r.status === 'pending' && expISO < todayISO);
          if (isOverdue) {
            const days = Math.max(
              0,
              Math.floor(
                (Date.parse(todayISO) - Date.parse(expISO)) / 86_400_000
              )
            );
            overdueList.push({
              id: r.id,
              contractor_id: r.contractor_id ?? null,
              contractor_title: '—', // заполним после запроса компаний
              expected_date: expISO,
              days_overdue: days,
              status: r.status === 'due' ? 'due' : 'pending',
              amount_expected: Number(r.amount_expected ?? 0),
              amount_received: Number(r.amount_received ?? 0),
            });
          }
        }
      });

      const acceptanceRate = total ? accepted / total : 0;
      const onTimeRate = accepted ? acceptedOnTime / accepted : 0;
      const trend = Array.from(byDay.values()).sort((a, b) =>
        a.day < b.day ? -1 : 1
      );

      // 3) Разбивка по компаниям
      const byCompany = new Map<string, CompanyRow>();
      rows.forEach((r) => {
        const key = r.contractor_id ?? 'unknown';
        const row = byCompany.get(key) ?? {
          contractor_id: key,
          contractor_title: '',
          total_deliveries: 0,
          accepted: 0,
          acceptanceRate: 0,
          consignments_open: 0,
          consignments_overdue: 0,
          amount_expected_total: 0,
          amount_received_total: 0,
          last_delivery_date: null as string | null,
        };

        row.total_deliveries += 1;
        if (r.status === 'accepted') row.accepted += 1;

        if (r.is_consignement && r.consignment_status === 'open') {
          row.consignments_open += 1;
          if (
            r.consignment_due_date &&
            r.consignment_due_date.slice(0, 10) < todayISO
          ) {
            row.consignments_overdue += 1;
          }
        }

        row.amount_expected_total += Number(r.amount_expected ?? 0);
        row.amount_received_total += Number(r.amount_received ?? 0);

        const exp = r.expected_date?.slice(0, 10);
        if (exp && (!row.last_delivery_date || exp > row.last_delivery_date)) {
          row.last_delivery_date = exp;
        }

        byCompany.set(key, row);
      });

      // 4) Подтягиваем названия компаний и заполняем acceptanceRate + overdueList titles
      const companyIds = Array.from(byCompany.keys()).filter(
        (id) => id !== 'unknown'
      );
      if (companyIds.length) {
        const { data: companies, error: cErr } = await supabase
          .from('contractors')
          .select('id,title')
          .in('id', companyIds);

        if (!cErr) {
          const map = new Map<string, string>(
            (companies as ContractorRow[]).map((c) => [c.id, c.title])
          );
          byCompany.forEach((row, id) => {
            row.contractor_title =
              id === 'unknown' ? '—' : (map.get(id) ?? '—');
            row.acceptanceRate = row.total_deliveries
              ? row.accepted / row.total_deliveries
              : 0;
          });
          overdueList.forEach((o) => {
            o.contractor_title = o.contractor_id
              ? (map.get(o.contractor_id) ?? '—')
              : '—';
          });
        } else {
          // fallback без названий
          byCompany.forEach((row) => {
            row.contractor_title = row.contractor_title || '—';
            row.acceptanceRate = row.total_deliveries
              ? row.accepted / row.total_deliveries
              : 0;
          });
        }
      } else {
        byCompany.forEach((row) => {
          row.contractor_title = '—';
          row.acceptanceRate = row.total_deliveries
            ? row.accepted / row.total_deliveries
            : 0;
        });
      }

      if (!cancelled) {
        setData({
          deliveries: {
            total,
            accepted,
            pending,
            due,
            canceled,
            acceptanceRate,
            onTimeRate,
            consignmentsOpen,
            consignmentsOverdue,
            amountExpected,
            amountReceived,
          },
          trend,
          companies: Array.from(byCompany.values()).sort(
            (a, b) => b.total_deliveries - a.total_deliveries
          ),
          attention: rows.reduce<AttentionItem[]>((acc, r) => {
            const exp = r.expected_date?.slice(0, 10);
            const dueDate = r.consignment_due_date?.slice(0, 10);
            if (r.status === 'pending' && exp === todayISO) {
              acc.push({
                id: r.id,
                type: 'delivery_due_today',
                title: 'Поставка к приёмке сегодня',
                subtitle: 'Статус: pending',
                expected_date: exp,
                contractor_id: r.contractor_id ?? null,
              });
            }
            if (
              r.status === 'due' ||
              (r.status === 'pending' && exp && exp < todayISO)
            ) {
              acc.push({
                id: r.id,
                type: 'delivery_overdue',
                title: 'Просроченная поставка',
                subtitle: `Ожидалась: ${exp}`,
                expected_date: exp,
                contractor_id: r.contractor_id ?? null,
              });
            }
            if (
              r.is_consignement &&
              r.consignment_status === 'open' &&
              dueDate &&
              dueDate < todayISO
            ) {
              acc.push({
                id: r.id,
                type: 'consignment_overdue',
                title: 'Просроченная консигнация',
                subtitle: `Срок: ${dueDate}`,
                consignment_due_date: dueDate,
                contractor_id: r.contractor_id ?? null,
              });
            }
            return acc;
          }, []),
          overdueDeliveries: overdueList.sort(
            (a, b) => b.days_overdue - a.days_overdue
          ),
        });
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [from, to]);

  return {
    stats: data,
    isLoading,
    error,
    from,
    to,
    refresh: () => setLoading((x) => !x),
  };
}
