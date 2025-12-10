'use client';

import { useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Building,
  CalendarDays,
  CheckCheck,
  PackageSearch,
  Wallet,
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

import { Money } from '@/components/numbers/money';
import { Period, useShopStats } from '@/lib/entities/statistics/hooks/useStats';
import { useActivateBackButton } from '@/lib/navigation/back-button/hooks';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from '@/lib/i18n';
import { toStatisticsDays } from '@/lib/url/generator';

function pct(v: number) {
  return `${Math.round((v || 0) * 100)}%`;
}

const CHART_COLORS = {
  accepted: '#10b981',
  pending: '#f59e0b',
  due: '#dc2626',
  canceled: '#6b7280',
};

function renderMoney(value: number | null | undefined, className?: string) {
  return (
    <Money className={className}>
      {value ?? 0}
    </Money>
  );
}

export function StatsPage() {
  useActivateBackButton();

  const t = useTranslations('statistics');
  const tStatus = useTranslations('statistics.delivery.status');
  const router = useRouter();
  const [period, setPeriod] = useState<Period>('month');
  const { stats, isLoading, error, from, to, statusTKey } =
    useShopStats(period);

  const periodLabels: Record<Period, string> = {
    day: t('period.day'),
    week: t('period.week'),
    month: t('period.month'),
    year: t('period.year'),
  };

  const daysInPeriod = Math.max(
    1,
    Math.floor((Date.parse(to) - Date.parse(from)) / 86_400_000) + 1
  );
  const avgExpensesPerDay = (stats?.expenses.total ?? 0) / daysInPeriod;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{t('title')}</h1>
          <p className="text-sm text-muted-foreground">
            {t('period.label')} <span className="font-medium">{from}</span> —{' '}
            <span className="font-medium">{to}</span>
          </p>
        </div>
        <Button
          variant="success"
          className="w-full h-12 rounded-xl px-6 text-base font-semibold gap-2 flex items-center justify-center"
          onClick={() => router.push(toStatisticsDays())}
        >
          <span>{t('by_day.button')}</span>
          <ArrowRight className="h-5 w-5 flex-shrink-0" />
        </Button>
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

      {/* KPI row: deliveries & consignments & expenses */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        {/* Deliveries total */}
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

        {/* Acceptance */}
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

        {/* To accept / overdue */}
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

        {/* Consignments */}
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
                <div className="text-xs text-muted-foreground flex flex-wrap items-center gap-1">
                  {isLoading ? (
                    '…'
                  ) : (
                    <>
                      {renderMoney(stats?.deliveries.amountExpected ?? 0)}
                      <span>/</span>
                      {renderMoney(stats?.deliveries.amountReceived ?? 0)}
                    </>
                  )}
                </div>
              </div>
              <div className="rounded-full p-2 bg-purple-500/10">
                <PackageSearch className="h-5 w-5 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Expenses total */}
        <Card className="border-l-4 border-l-sky-500">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs text-muted-foreground">
                  {t('expenses.total_label')}
                </p>
                <div className="text-xl font-semibold">
                  {isLoading ? '…' : renderMoney(stats?.expenses.total, 'text-xl')}
                </div>
                <p className="text-xs text-muted-foreground">
                  {t('expenses.types_count', {
                    count: isLoading ? 0 : (stats?.expenses.byType.length ?? 0),
                  })}
                </p>
              </div>
              <div className="rounded-full p-2 bg-sky-500/10">
                <Wallet className="h-5 w-5 text-sky-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Avg expenses per day */}
        <Card className="border-l-4 border-l-slate-500">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs text-muted-foreground">
                  {t('expenses.avg_per_day_label')}
                </p>
                <div className="text-xl font-semibold">
                  {isLoading ? '…' : renderMoney(avgExpensesPerDay, 'text-xl')}
                </div>
                <p className="text-xs text-muted-foreground">
                  {t('expenses.period_days', { count: daysInPeriod })}
                </p>
              </div>
              <div className="rounded-full p-2 bg-slate-500/10">
                <CalendarDays className="h-5 w-5 text-slate-500" />
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
                  <th className="whitespace-nowrap text-left p-2">
                    {t('table.company')}
                  </th>
                  <th className="whitespace-nowrap text-left p-2">
                    {t('table.expected')}
                  </th>
                  <th className="whitespace-nowrap text-left p-2">
                    {t('table.days_overdue')}
                  </th>
                  <th className="whitespace-nowrap text-left p-2">
                    {t('table.status')}
                  </th>
                  <th className="whitespace-nowrap text-left p-2">
                    {t('table.amounts')}
                  </th>
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
                        <div className="flex items-center gap-1">
                          {renderMoney(d.amount_expected, 'text-sm')}
                          <span>/</span>
                          {renderMoney(d.amount_received, 'text-sm')}
                        </div>
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
                    fill={CHART_COLORS.accepted}
                    name={t(statusTKey.accepted)}
                  />
                  <Bar
                    dataKey="pending"
                    stackId="a"
                    fill={CHART_COLORS.pending}
                    name={t(statusTKey.pending)}
                  />
                  <Bar
                    dataKey="due"
                    stackId="a"
                    fill={CHART_COLORS.due}
                    name={t(statusTKey.due)}
                  />
                  <Bar
                    dataKey="canceled"
                    stackId="a"
                    fill={CHART_COLORS.canceled}
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

      {/* Expenses by type */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">
              {t('expenses.by_type_title')}
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-muted/40">
                <tr>
                  <th className="whitespace-nowrap text-left p-2">
                    {t('table.type')}
                  </th>
                  <th className="whitespace-nowrap text-left p-2">
                    {t('table.count')}
                  </th>
                  <th className="whitespace-nowrap text-left p-2">
                    {t('table.total')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td className="p-2" colSpan={3}>
                      {t('loading')}
                    </td>
                  </tr>
                ) : (stats?.expenses.byType.length ?? 0) === 0 ? (
                  <tr>
                    <td className="p-2 text-muted-foreground" colSpan={3}>
                      {t('expenses.empty')}
                    </td>
                  </tr>
                ) : (
                  stats!.expenses.byType.map((row) => (
                    <tr key={row.type} className="border-b">
                      <td className="p-2">{row.type}</td>
                      <td className="p-2">{row.count}</td>
                      <td className="p-2">
                        {renderMoney(row.total, 'text-sm font-medium')}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
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
                  <th className="whitespace-nowrap text-left p-2">
                    {t('table.company')}
                  </th>
                  <th className="whitespace-nowrap text-left p-2">
                    {t('table.total')}
                  </th>
                  <th className="whitespace-nowrap text-left p-2">
                    {t('table.accepted')}
                  </th>
                  <th className="whitespace-nowrap text-left p-2">
                    {t('table.acceptance_rate')}
                  </th>
                  <th className="whitespace-nowrap text-left p-2">
                    {t('table.consignments_open_overdue')}
                  </th>
                  <th className="whitespace-nowrap text-left p-2">
                    {t('table.amounts')}
                  </th>
                  <th className="whitespace-nowrap text-left p-2">
                    {t('table.last_delivery')}
                  </th>
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
                        <div className="flex items-center gap-1">
                          {renderMoney(
                            r.amount_expected_total,
                            'text-sm font-medium'
                          )}
                          <span>/</span>
                          {renderMoney(
                            r.amount_received_total,
                            'text-sm font-medium'
                          )}
                        </div>
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
