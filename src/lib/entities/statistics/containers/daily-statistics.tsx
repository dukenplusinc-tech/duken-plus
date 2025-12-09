'use client';

import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, List, ScrollText } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useActivateBackButton } from '@/lib/navigation/back-button/hooks';
import { useDailyStats } from '@/lib/entities/statistics/hooks/useDailyStats';
import type { DayBreakdown } from '@/lib/entities/statistics/types';

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date: Date, months: number) {
  return new Date(date.getFullYear(), date.getMonth() + months, 1);
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('ru-KZ', {
    style: 'currency',
    currency: 'KZT',
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function formatDayLabel(value: string) {
  const date = new Date(value);
  return date.toLocaleDateString(undefined, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    weekday: 'long',
  });
}

function formatShortDate(value: string) {
  const date = new Date(value);
  return date.toLocaleDateString(undefined, {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

function getDaysLate(selectedDay: string, dueISO: string | null) {
  if (!selectedDay || !dueISO) return null;
  const selected = new Date(selectedDay);
  const due = new Date(dueISO);
  const diff = Math.floor(
    (selected.setHours(0, 0, 0, 0) - due.setHours(0, 0, 0, 0)) / 86_400_000
  );
  return diff < 0 ? 0 : diff;
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <ScrollText className="h-4 w-4" />
          <span className="font-medium text-foreground">{title}</span>
        </div>
        {children}
      </CardContent>
    </Card>
  );
}

function AcceptedCompaniesSection({
  day,
  emptyLabel,
  totalLabel,
}: {
  day: DayBreakdown;
  emptyLabel: string;
  totalLabel: string;
}) {
  if (!day.accepted.length) {
    return <p className="text-sm text-muted-foreground">{emptyLabel}</p>;
  }

  const total = day.accepted.reduce(
    (sum, delivery) =>
      sum + (delivery.amount_received ?? delivery.amount_expected ?? 0),
    0
  );

  return (
    <div className="space-y-2">
      {day.accepted.map((delivery) => {
        const actual = Number(delivery.amount_received ?? delivery.amount_expected ?? 0);
        const expected = Number(delivery.amount_expected ?? 0);
        const showDifference = !!delivery.amount_received && expected !== actual;

        return (
          <div
            key={delivery.id}
            className="flex items-center justify-between rounded-md border p-3"
          >
            <div>
              <p className="text-sm font-medium">{delivery.contractor_title}</p>
              {showDifference && (
                <p className="text-xs text-muted-foreground line-through">
                  {formatCurrency(expected)}
                </p>
              )}
            </div>
            <p className="text-sm font-semibold">{formatCurrency(actual)}</p>
          </div>
        );
      })}
      <div className="flex items-center justify-between border-t pt-2 text-sm font-semibold">
        <span>{totalLabel}</span>
        <span>{formatCurrency(total)}</span>
      </div>
    </div>
  );
}

function DayExpensesSection({
  day,
  emptyLabel,
  totalLabel,
}: {
  day: DayBreakdown;
  emptyLabel: string;
  totalLabel: string;
}) {
  if (!day.expenses.length) {
    return <p className="text-sm text-muted-foreground">{emptyLabel}</p>;
  }

  const total = day.expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="space-y-2">
      {day.expenses.map((expense) => (
        <div
          key={expense.id}
          className="flex items-center justify-between rounded-md border p-3"
        >
          <p className="text-sm font-medium">{expense.type}</p>
          <p className="text-sm font-semibold">{formatCurrency(expense.amount)}</p>
        </div>
      ))}
      <div className="flex items-center justify-between border-t pt-2 text-sm font-semibold">
        <span>{totalLabel}</span>
        <span>{formatCurrency(total)}</span>
      </div>
    </div>
  );
}

function ConsignmentsSection({
  day,
  emptyLabel,
  acceptedDateLabel,
  overdueLabel,
  formatDaysLate,
  amountLabel,
}: {
  day: DayBreakdown;
  emptyLabel: string;
  acceptedDateLabel: string;
  overdueLabel: string;
  formatDaysLate: (days: number) => string;
  amountLabel: string;
}) {
  if (!day.consignments.length) {
    return <p className="text-sm text-muted-foreground">{emptyLabel}</p>;
  }

  return (
    <div className="space-y-2">
      {day.consignments.map((delivery) => {
        const delay = getDaysLate(day.date, delivery.consignment_due_date);
        const actual = Number(delivery.amount_expected ?? 0);
        const acceptedDate = delivery.accepted_date
          ? formatShortDate(delivery.accepted_date.slice(0, 10))
          : '—';

        return (
          <div
            key={delivery.id}
            className="rounded-md border p-3 space-y-1 text-sm"
          >
            <p className="font-medium">{delivery.contractor_title}</p>
            <div className="grid grid-cols-2 gap-1 text-xs text-muted-foreground">
              <span>
                {acceptedDateLabel}: {acceptedDate}
              </span>
              <span>
                {overdueLabel}:{' '}
                {delay === null ? '—' : formatDaysLate(delay)}
              </span>
            </div>
            <p className="text-sm font-semibold">
              {amountLabel}: {formatCurrency(actual)}
            </p>
          </div>
        );
      })}
    </div>
  );
}

function NotAcceptedSection({
  day,
  emptyLabel,
  statusLabel,
}: {
  day: DayBreakdown;
  emptyLabel: string;
  statusLabel: (status: string) => string;
}) {
  if (!day.others.length) {
    return <p className="text-sm text-muted-foreground">{emptyLabel}</p>;
  }

  return (
    <div className="space-y-2">
      {day.others.map((delivery) => (
        <div
          key={delivery.id}
          className="flex items-center justify-between rounded-md border p-3"
        >
          <div>
            <p className="text-sm font-medium">{delivery.contractor_title}</p>
            <p className="text-xs text-muted-foreground">
              {statusLabel(delivery.status)}
            </p>
          </div>
          <p className="text-sm font-semibold">
            {formatCurrency(delivery.amount_expected ?? 0)}
          </p>
        </div>
      ))}
    </div>
  );
}

export function DailyStatsPage() {
  useActivateBackButton();
  const t = useTranslations('statistics.by_day');
  const tStatus = useTranslations('statistics.delivery.status');
  const [monthCursor, setMonthCursor] = useState(() => startOfMonth(new Date()));
  const { days, totals, isLoading, error, range } = useDailyStats(monthCursor);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    if (!days.length) {
      setSelectedDate(null);
      return;
    }
    if (!selectedDate || !days.find((day) => day.date === selectedDate)) {
      setSelectedDate(days[0].date);
    }
  }, [days, selectedDate]);

  const selectedDay = useMemo(
    () => days.find((day) => day.date === selectedDate),
    [days, selectedDate]
  );

  const todayStart = startOfMonth(new Date());
  const canGoNext = addMonths(monthCursor, 1) <= todayStart;

  const monthLabel = new Intl.DateTimeFormat(undefined, {
    month: 'long',
    year: 'numeric',
  }).format(monthCursor);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase text-muted-foreground tracking-wide">
            {t('title')}
          </p>
          <h1 className="text-2xl font-semibold">{monthLabel}</h1>
          <p className="text-sm text-muted-foreground">
            {t('range', { from: range.from, to: range.to })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMonthCursor((prev) => addMonths(prev, -1))}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            {t('navigation.prev')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={!canGoNext}
            onClick={() => setMonthCursor((prev) => addMonths(prev, 1))}
          >
            {t('navigation.next')}
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{t('month_total')}</p>
            <p className="text-2xl font-semibold">
              {formatCurrency(totals.expenses)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">
              {t('month_deliveries')}
            </p>
            <p className="text-lg font-semibold">
              {formatCurrency(totals.deliveriesAmount)}
            </p>
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="text-red-600 text-sm border border-red-200 bg-red-50 p-3 rounded-md">
          {t('error_prefix')} {error}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <List className="h-4 w-4" />
              <span>{t('days_list.title')}</span>
            </div>
            <div className="border rounded-md divide-y">
              {isLoading && (
                <div className="p-4 text-sm text-muted-foreground">
                  {t('loading')}
                </div>
              )}
              {!isLoading && days.length === 0 && (
                <div className="p-4 text-sm text-muted-foreground">
                  {t('days_list.empty')}
                </div>
              )}
              {!isLoading &&
                days.map((day) => {
                  const isSelected = day.date === selectedDate;
                  return (
                    <button
                      key={day.date}
                      className={`w-full text-left flex items-center justify-between px-4 py-3 text-sm transition ${
                        isSelected
                          ? 'bg-primary/10 text-primary font-semibold'
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={() => setSelectedDate(day.date)}
                    >
                      <div>
                        <p className="font-medium">{formatDayLabel(day.date)}</p>
                        <p className="text-xs text-muted-foreground">
                          {t('days_list.deliveries', {
                            count: day.deliveriesCount,
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p>{formatCurrency(day.expensesTotal)}</p>
                        <p className="text-xs text-muted-foreground">
                          {t('days_list.expenses')}
                        </p>
                      </div>
                    </button>
                  );
                })}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {!selectedDay ? (
            <Card>
              <CardContent className="p-6 text-center text-sm text-muted-foreground">
                {isLoading ? t('loading') : t('details_placeholder')}
              </CardContent>
            </Card>
          ) : (
            <>
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">
                    {t('selected_day.label')}
                  </p>
                  <p className="text-xl font-semibold">
                    {formatDayLabel(selectedDay.date)}
                  </p>
                </CardContent>
              </Card>

              <Section title={t('sections.accepted')}>
                <AcceptedCompaniesSection
                  day={selectedDay}
                  emptyLabel={t('empty.accepted')}
                  totalLabel={t('totals.accepted')}
                />
              </Section>

              <Section title={t('sections.expenses')}>
                <DayExpensesSection
                  day={selectedDay}
                  emptyLabel={t('empty.expenses')}
                  totalLabel={t('totals.expenses')}
                />
              </Section>

              <Section title={t('sections.consignments')}>
                <ConsignmentsSection
                  day={selectedDay}
                  emptyLabel={t('empty.consignments')}
                  acceptedDateLabel={t('labels.accepted_date')}
                  overdueLabel={t('labels.overdue')}
                  formatDaysLate={(days) => t('labels.days', { count: days })}
                  amountLabel={t('labels.amount')}
                />
              </Section>

              <Section title={t('sections.notAccepted')}>
                <NotAcceptedSection
                  day={selectedDay}
                  emptyLabel={t('empty.notAccepted')}
                  statusLabel={(status) => tStatus(status as any)}
                />
              </Section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}


