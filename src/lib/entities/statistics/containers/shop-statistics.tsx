'use client';

import { useState } from 'react';
import {
  AlertTriangle,
  BarChart3,
  Building,
  CheckCheck,
  PackageSearch,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { Period, useShopStats } from '@/lib/entities/statistics/hooks/useStats';
import { Card, CardContent } from '@/components/ui/card';

function pct(v: number) {
  return `${Math.round((v || 0) * 100)}%`;
}
function fmtMoney(n: number) {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(n || 0);
}

export function StatsPage() {
  const [period, setPeriod] = useState<Period>('month');
  const { stats, isLoading, error, from, to } = useShopStats(period);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">Статистика магазина</h1>
        <p className="text-sm text-muted-foreground">
          Период: <span className="font-medium">{from}</span> —{' '}
          <span className="font-medium">{to}</span>
        </p>
      </div>

      {/* Period selector */}
      <div className="grid grid-cols-4 gap-2">
        {(['day', 'week', 'month', 'year'] as const).map((p) => (
          <button
            key={p}
            className={`py-2 rounded-md text-sm border ${period === p ? 'bg-primary text-primary-foreground border-primary' : 'bg-background text-primary border-border'}`}
            onClick={() => setPeriod(p)}
          >
            {p === 'day'
              ? 'День'
              : p === 'week'
                ? 'Неделя'
                : p === 'month'
                  ? 'Месяц'
                  : 'Год'}
          </button>
        ))}
      </div>

      {error && (
        <div className="text-sm text-red-600">Ошибка загрузки: {error}</div>
      )}

      {/* KPI row: deliveries & consignments */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs text-muted-foreground">
                  Поставки (всего)
                </p>
                <p className="text-xl font-semibold">
                  {isLoading ? '…' : (stats?.deliveries.total ?? 0)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Принято: {isLoading ? '…' : (stats?.deliveries.accepted ?? 0)}
                </p>
              </div>
              <div className="rounded-full p-2 bg-blue-500/10">
                <CheckCheck className="h-5 w-5 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs text-muted-foreground">% приёмки</p>
                <p className="text-xl font-semibold">
                  {isLoading ? '…' : pct(stats?.deliveries.acceptanceRate ?? 0)}
                </p>
                <p className="text-xs text-muted-foreground">
                  он-тайм:{' '}
                  {isLoading ? '…' : pct(stats?.deliveries.onTimeRate ?? 0)}
                </p>
              </div>
              <div className="rounded-full p-2 bg-emerald-500/10">
                <BarChart3 className="h-5 w-5 text-emerald-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs text-muted-foreground">
                  К приёмке / Просрочено
                </p>
                <p className="text-xl font-semibold">
                  {isLoading
                    ? '…'
                    : `${stats?.deliveries.pending ?? 0} / ${stats?.deliveries.due ?? 0}`}
                </p>
                <p className="text-xs text-muted-foreground">
                  Отменено:{' '}
                  {isLoading ? '…' : (stats?.deliveries.canceled ?? 0)}
                </p>
              </div>
              <div className="rounded-full p-2 bg-amber-500/10">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs text-muted-foreground">Консигнации</p>
                <p className="text-xl font-semibold">
                  {isLoading
                    ? '…'
                    : `${stats?.deliveries.consignmentsOpen ?? 0} / ${stats?.deliveries.consignmentsOverdue ?? 0}`}
                </p>
                <p className="text-xs text-muted-foreground">
                  {isLoading
                    ? '…'
                    : `${fmtMoney(stats?.deliveries.amountExpected ?? 0)} / ${fmtMoney(stats?.deliveries.amountReceived ?? 0)}`}
                </p>
              </div>
              <div className="rounded-full p-2 bg-purple-500/10">
                <PackageSearch className="h-5 w-5 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attention panel */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Требует внимания</p>
            <span className="text-xs text-muted-foreground">
              {isLoading ? '' : (stats?.attention.length ?? 0)} элементов
            </span>
          </div>
          <div className="mt-3 space-y-2">
            {isLoading && (
              <div className="text-sm text-muted-foreground">Загрузка…</div>
            )}
            {!isLoading && (stats?.attention.length ?? 0) === 0 && (
              <div className="text-sm text-muted-foreground">
                Всё хорошо. Срочных задач нет.
              </div>
            )}
            {!isLoading &&
              (stats?.attention ?? []).slice(0, 6).map((a) => (
                <div
                  key={a.id}
                  className="flex items-start justify-between border rounded-md p-2"
                >
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">
                      {a.type === 'delivery_due_today' &&
                        'Поставка к приёмке сегодня'}
                      {a.type === 'delivery_overdue' && 'Просроченная поставка'}
                      {a.type === 'consignment_overdue' &&
                        'Просроченная консигнация'}
                    </p>
                    {a.subtitle && (
                      <p className="text-xs text-muted-foreground">
                        {a.subtitle}
                      </p>
                    )}
                  </div>
                  <AlertTriangle className="h-4 w-4 text-amber-500 mt-1" />
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Overdue deliveries */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">
              Просроченные поставки
            </p>
            <span className="text-xs text-muted-foreground">
              {isLoading ? '' : (stats?.overdueDeliveries?.length ?? 0)} шт.
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-muted/40">
                <tr>
                  <th className="text-left p-2">Компания</th>
                  <th className="text-left p-2">Ожидалась</th>
                  <th className="text-left p-2">Дней просрочки</th>
                  <th className="text-left p-2">Статус</th>
                  <th className="text-left p-2">Сумма (ожид./получ.)</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td className="p-2" colSpan={5}>
                      Загрузка…
                    </td>
                  </tr>
                ) : (stats?.overdueDeliveries?.length ?? 0) === 0 ? (
                  <tr>
                    <td className="p-2 text-muted-foreground" colSpan={5}>
                      Просроченных поставок нет
                    </td>
                  </tr>
                ) : (
                  stats!.overdueDeliveries.slice(0, 10).map((d) => (
                    <tr key={d.id} className="border-b">
                      <td className="p-2">{d.contractor_title}</td>
                      <td className="p-2">{d.expected_date}</td>
                      <td className="p-2">{d.days_overdue}</td>
                      <td className="p-2">
                        {d.status === 'due' ? 'due' : 'pending'}
                      </td>
                      <td className="p-2">
                        {fmtMoney(d.amount_expected)} /{' '}
                        {fmtMoney(d.amount_received)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Trend chart */}
      <Card>
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground mb-2">Поставки по дням</p>
          <div className="h-56">
            {isLoading ? (
              <div className="text-sm text-muted-foreground">Загрузка…</div>
            ) : (stats?.trend.length ?? 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats!.trend}>
                  <XAxis dataKey="day" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="accepted" stackId="a" />
                  <Bar dataKey="pending" stackId="a" />
                  <Bar dataKey="due" stackId="a" />
                  <Bar dataKey="canceled" stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-sm text-muted-foreground">
                Нет данных за выбранный период
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Companies leaderboard */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">
              Разбивка по компаниям
            </p>
            <Building className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-muted/40">
                <tr>
                  <th className="text-left p-2">Компания</th>
                  <th className="text-left p-2">Всего</th>
                  <th className="text-left p-2">Принято</th>
                  <th className="text-left p-2">% приёмки</th>
                  <th className="text-left p-2">Консиг. откр./проср.</th>
                  <th className="text-left p-2">Суммы (ожид./получ.)</th>
                  <th className="text-left p-2">Последняя поставка</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td className="p-2" colSpan={7}>
                      Загрузка…
                    </td>
                  </tr>
                ) : (
                  (stats?.companies ?? []).map((r) => (
                    <tr key={r.contractor_id} className="border-b">
                      <td className="p-2">{r.contractor_title}</td>
                      <td className="p-2">{r.total_deliveries}</td>
                      <td className="p-2">{r.accepted}</td>
                      <td className="p-2">{pct(r.acceptanceRate)}</td>
                      <td className="p-2">
                        {r.consignments_open}/{r.consignments_overdue}
                      </td>
                      <td className="p-2">
                        {fmtMoney(r.amount_expected_total)} /{' '}
                        {fmtMoney(r.amount_received_total)}
                      </td>
                      <td className="p-2">{r.last_delivery_date ?? '—'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
