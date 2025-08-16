'use client';

import { useState } from 'react';
import {
  AlertTriangle,
  BarChart3,
  Building,
  CheckCheck,
  PackageSearch,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
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
  return new Intl.NumberFormat('ru-KZ', {
    style: 'currency',
    currency: 'KZT',
    maximumFractionDigits: 0,
  }).format(n || 0);
}

export function StatsPage() {
  const t = useTranslations('statistics');
  const tStatus = useTranslations('statistics.delivery.status'); // for statuses in legends/tables
  const [period, setPeriod] = useState<Period>('month');
  const { stats, isLoading, error, from, to, statusTKey } =
    useShopStats(period);

  const periodLabels: Record<Period, string> = {
    day: t('period.day'),
    week: t('period.week'),
    month: t('period.month'),
    year: t('period.year'),
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">{t('title')}</h1>
        <p className="text-sm text-muted-foreground">
          {t('period.label')} <span className="font-medium">{from}</span> —{' '}
          <span className="font-medium">{to}</span>
        </p>
      </div>

      {/* Period selector */}
      <div className="grid grid-cols-4 gap-2">
        {(['day', 'week', 'month', 'year'] as const).map((p) => (
          <button
            key={p}
            className={`py-2 rounded-md text-sm border ${
              period === p
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background text-primary border-border'
            }`}
            onClick={() => setPeriod(p)}
            aria-pressed={period === p}
          >
            {periodLabels[p]}
          </button>
        ))}
      </div>

      {error && (
        <div className="text-sm text-red-600">
          {t('error.load_failed')}: {error}
        </div>
      )}

      {/* KPI row: deliveries & consignments */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs text-muted-foreground">
                  {t('kpi.deliveries_total')}
                </p>
                <p className="text-xl font-semibold">
                  {isLoading ? '…' : (stats?.deliveries.total ?? 0)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t('kpi.accepted')}:{' '}
                  {isLoading ? '…' : (stats?.deliveries.accepted ?? 0)}
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
                <p className="text-xs text-muted-foreground">
                  {t('kpi.acceptance_rate')}
                </p>
                <p className="text-xl font-semibold">
                  {isLoading ? '…' : pct(stats?.deliveries.acceptanceRate ?? 0)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t('kpi.on_time')}:{' '}
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
                  {t('kpi.to_accept_overdue')}
                </p>
                <p className="text-xl font-semibold">
                  {isLoading
                    ? '…'
                    : `${stats?.deliveries.pending ?? 0} / ${stats?.deliveries.due ?? 0}`}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t('kpi.canceled')}:{' '}
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
                <p className="text-xs text-muted-foreground">
                  {t('kpi.consignments')}
                </p>
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
            <p className="text-sm text-muted-foreground">
              {t('attention.title')}
            </p>
            <span className="text-xs text-muted-foreground">
              {isLoading ? '' : (stats?.attention.length ?? 0)}{' '}
              {t('attention.items_suffix')}
            </span>
          </div>
          <div className="mt-3 space-y-2">
            {isLoading && (
              <div className="text-sm text-muted-foreground">
                {t('loading')}
              </div>
            )}
            {!isLoading && (stats?.attention.length ?? 0) === 0 && (
              <div className="text-sm text-muted-foreground">
                {t('attention.empty')}
              </div>
            )}
            {!isLoading &&
              (stats?.attention ?? []).slice(0, 6).map((a) => (
                <div
                  key={a.id}
                  className="flex items-start justify-between border rounded-md p-2"
                >
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">{t(a.title_tkey)}</p>
                    {a.subtitle_tkey && (
                      <p className="text-xs text-muted-foreground">
                        {t(a.subtitle_tkey, {
                          // nested translate for status labels if present
                          status:
                            a.subtitle_params?.status &&
                            t(a.subtitle_params.status as string),
                          date: a.subtitle_params?.date,
                        })}
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
              {t('overdue.title')}
            </p>
            <span className="text-xs text-muted-foreground">
              {isLoading ? '' : (stats?.overdueDeliveries?.length ?? 0)}{' '}
              {t('overdue.count_suffix')}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-muted/40">
                <tr>
                  <th className="text-left p-2">{t('table.company')}</th>
                  <th className="text-left p-2">{t('table.expected')}</th>
                  <th className="text-left p-2">{t('table.days_overdue')}</th>
                  <th className="text-left p-2">{t('table.status')}</th>
                  <th className="text-left p-2">{t('table.amounts')}</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td className="p-2" colSpan={5}>
                      {t('loading')}
                    </td>
                  </tr>
                ) : (stats?.overdueDeliveries?.length ?? 0) === 0 ? (
                  <tr>
                    <td className="p-2 text-muted-foreground" colSpan={5}>
                      {t('overdue.empty')}
                    </td>
                  </tr>
                ) : (
                  stats!.overdueDeliveries.slice(0, 10).map((d) => (
                    <tr key={d.id} className="border-b">
                      <td className="p-2">{d.contractor_title}</td>
                      <td className="p-2">{d.expected_date}</td>
                      <td className="p-2">{d.days_overdue}</td>
                      <td className="p-2">{tStatus(d.status)}</td>
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
          <p className="text-sm text-muted-foreground mb-2">
            {t('trend.title')}
          </p>
          <div className="h-56">
            {isLoading ? (
              <div className="text-sm text-muted-foreground">
                {t('loading')}
              </div>
            ) : (stats?.trend.length ?? 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats!.trend}>
                  <XAxis dataKey="day" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="accepted"
                    stackId="a"
                    name={t(statusTKey.accepted)}
                  />
                  <Bar
                    dataKey="pending"
                    stackId="a"
                    name={t(statusTKey.pending)}
                  />
                  <Bar dataKey="due" stackId="a" name={t(statusTKey.due)} />
                  <Bar
                    dataKey="canceled"
                    stackId="a"
                    name={t(statusTKey.canceled)}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-sm text-muted-foreground">
                {t('trend.empty')}
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
              {t('companies.title')}
            </p>
            <Building className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-muted/40">
                <tr>
                  <th className="text-left p-2">{t('table.company')}</th>
                  <th className="text-left p-2">{t('table.total')}</th>
                  <th className="text-left p-2">{t('table.accepted')}</th>
                  <th className="text-left p-2">
                    {t('table.acceptance_rate')}
                  </th>
                  <th className="text-left p-2">
                    {t('table.consignments_open_overdue')}
                  </th>
                  <th className="text-left p-2">{t('table.amounts')}</th>
                  <th className="text-left p-2">{t('table.last_delivery')}</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td className="p-2" colSpan={7}>
                      {t('loading')}
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
