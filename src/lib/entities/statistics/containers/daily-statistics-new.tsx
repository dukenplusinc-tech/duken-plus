'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

import { useFiltersCtx } from '@/lib/composite/filters/context';
import { FiltersProvider } from '@/lib/composite/filters/provider';
import { SortButton } from '@/lib/composite/filters/ui/sort-button';
import { useShop } from '@/lib/entities/shop/hooks/useShop';
import { useDailyStats } from '@/lib/entities/statistics/hooks/useDailyStats';
import type { DayBreakdown } from '@/lib/entities/statistics/types';
import {
  formatDayLabel,
  getAllDaysInMonth,
  startOfMonth,
  toISODate,
} from '@/lib/entities/statistics/utils/date';
import { useActivateBackButton } from '@/lib/navigation/back-button/hooks';
import * as fromUrl from '@/lib/url/generator';
import { PageHeader } from '@/components/ui/page/header';
import { Money } from '@/components/numbers/money';

// ============================================================================
// Utility Functions
// ============================================================================

function addMonths(date: Date, months: number) {
  return new Date(date.getFullYear(), date.getMonth() + months, 1);
}

function isToday(dateISO: string): boolean {
  const today = new Date();
  const date = new Date(dateISO);
  return (
    today.getFullYear() === date.getFullYear() &&
    today.getMonth() === date.getMonth() &&
    today.getDate() === date.getDate()
  );
}

// ============================================================================
// Month Navigation Component
// ============================================================================

interface MonthNavigationProps {
  monthCursor: Date;
  canGoPrev: boolean;
  canGoNext: boolean;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

function MonthNavigation({
  monthCursor,
  canGoPrev,
  canGoNext,
  onPrevMonth,
  onNextMonth,
}: MonthNavigationProps) {
  const t = useTranslations('statistics.by_day');
  const locale = useLocale();

  const monthLabel = new Intl.DateTimeFormat(locale, {
    month: 'long',
    year: 'numeric',
  }).format(monthCursor);

  return (
    <div className="bg-white px-4 py-4 flex items-center justify-between gap-2">
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={onPrevMonth}
          disabled={!canGoPrev}
          className="h-[38px] w-[38px] flex items-center justify-center bg-[#0f5463] hover:bg-[#1a6575] disabled:opacity-30 disabled:cursor-not-allowed rounded-lg transition-colors flex-shrink-0"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>

        <div className="flex-1 flex items-center justify-center min-w-[150px] h-[38px] bg-gray-50 rounded-lg mx-2">
          <p className="text-gray-900 text-sm font-semibold capitalize">
            {monthLabel}
          </p>
        </div>

        <button
          onClick={onNextMonth}
          disabled={!canGoNext}
          className="h-[38px] w-[38px] flex items-center justify-center bg-[#0f5463] hover:bg-[#1a6575] disabled:opacity-30 disabled:cursor-not-allowed rounded-lg transition-colors flex-shrink-0"
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </button>
      </div>

      <div className="ml-1">
        <SortButton
          sortByOptions={[
            { label: t('sort.by_date'), value: 'date' },
            { label: t('sort.by_amount'), value: 'amount' },
          ]}
          defaultSortBy="date"
        />
      </div>
    </div>
  );
}

// ============================================================================
// Days List Component
// ============================================================================

// Helper function to calculate real paid total (expenses + accepted deliveries + paid consignments)
function calculateRealPaidTotal(day: DayBreakdown): number {
  const expenses = day.expensesTotal;
  const acceptedDeliveries = day.accepted.reduce(
    (sum, delivery) =>
      sum + (delivery.amount_received ?? delivery.amount_expected ?? 0),
    0
  );
  const paidConsignments = day.consignments
    .filter((delivery) => delivery.consignment_status === 'closed')
    .reduce(
      (sum, delivery) =>
        sum + (delivery.amount_received ?? delivery.amount_expected ?? 0),
      0
    );
  return expenses + acceptedDeliveries + paidConsignments;
}

// Helper function to calculate predicted total (unpaid consignments + not accepted deliveries)
function calculatePredictedTotal(day: DayBreakdown): number {
  const unpaidConsignments = day.consignments
    .filter((delivery) => delivery.consignment_status !== 'closed')
    .reduce(
      (sum, delivery) =>
        sum + (delivery.amount_received ?? delivery.amount_expected ?? 0),
      0
    );
  const notAcceptedDeliveries = day.others.reduce(
    (sum, delivery) =>
      sum + (delivery.amount_received ?? delivery.amount_expected ?? 0),
    0
  );
  return unpaidConsignments + notAcceptedDeliveries;
}

// Helper function to calculate total for a day (for sorting - uses real paid total)
function calculateDayTotal(day: DayBreakdown): number {
  return calculateRealPaidTotal(day);
}

interface DaysListProps {
  days: DayBreakdown[];
  isLoading: boolean;
  totalExpenses: number;
  monthCursor: Date;
  onSelectDay: (date: string) => void;
}

function DaysList({ days, monthCursor, onSelectDay }: DaysListProps) {
  const t = useTranslations('statistics.by_day');
  const { sorting } = useFiltersCtx();

  // Create a map of days with data for quick lookup
  const daysMap = useMemo(() => {
    const map = new Map<string, DayBreakdown>();
    days.forEach((day) => {
      map.set(day.date, day);
    });
    return map;
  }, [days]);

  // Get all days in the month, but filter out future dates
  const allDaysInMonth = useMemo(() => {
    const allDays = getAllDaysInMonth(monthCursor);
    const todayISO = toISODate(new Date());
    
    // Filter out future dates
    return allDays.filter((dateISO) => dateISO <= todayISO);
  }, [monthCursor]);

  // Merge all days with data, creating empty entries for days without data
  const allDays = useMemo(() => {
    const merged = allDaysInMonth.map((dateISO) => {
      const existingDay = daysMap.get(dateISO);
      if (existingDay) {
        return existingDay;
      }
      // Create empty day breakdown for days without data (including future dates)
      return {
        date: dateISO,
        expensesTotal: 0,
        deliveriesAmountTotal: 0,
        deliveriesCount: 0,
        accepted: [],
        others: [],
        consignments: [],
        expenses: [],
      };
    });

    // Apply sorting
    const sortOption = sorting[0];
    if (sortOption) {
      const { id: sortBy, desc } = sortOption;
      return [...merged].sort((a, b) => {
        let comparison = 0;
        if (sortBy === 'date') {
          comparison = a.date < b.date ? -1 : a.date > b.date ? 1 : 0;
        } else if (sortBy === 'amount') {
          comparison = calculateDayTotal(a) - calculateDayTotal(b);
        }
        return desc ? -comparison : comparison;
      });
    }

    // Default: sort by date descending (newest first)
    return [...merged].sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [allDaysInMonth, daysMap, sorting]);

  // Calculate month totals
  const monthRealTotal = useMemo(() => {
    return allDays.reduce((sum, day) => sum + calculateRealPaidTotal(day), 0);
  }, [allDays]);

  const monthPredictedTotal = useMemo(() => {
    return allDays.reduce((sum, day) => sum + calculatePredictedTotal(day), 0);
  }, [allDays]);

  return (
    <>
      <div>
        {allDays.map((day) => {
          const isCurrentDay = isToday(day.date);
          return (
            <div
              key={day.date}
              onClick={() => onSelectDay(day.date)}
              className={`grid grid-cols-2 gap-4 py-4 border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer group ${
                isCurrentDay ? 'bg-blue-50 hover:bg-blue-100' : ''
              }`}
            >
              <div
                className={`text-base ${isCurrentDay ? 'text-blue-700 font-semibold' : 'text-gray-900'}`}
              >
                {formatDayLabel(day.date)}
              </div>
              <div className="text-right flex items-center justify-end gap-2">
                <div className="flex flex-col items-end gap-0.5">
                  <span
                    className={`font-semibold text-base ${isCurrentDay ? 'text-blue-700' : 'text-gray-900'}`}
                  >
                    <Money>{calculateRealPaidTotal(day)}</Money>
                  </span>
                  {calculatePredictedTotal(day) > 0 && (
                    <span className="text-red-500 text-xs line-through">
                      <Money>{calculatePredictedTotal(day)}</Money>
                    </span>
                  )}
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-4 py-4 bg-green-100 -mx-4 px-4 mt-0">
        <div className="text-gray-900 font-semibold text-base">
          {t('totals.label')}
        </div>
        <div className="text-right">
          <div className="flex flex-col items-end gap-1">
            <span className="text-gray-900 font-bold text-lg">
              <Money>{monthRealTotal}</Money>
            </span>
            {monthPredictedTotal > 0 && (
              <span className="text-red-500 text-sm line-through">
                <Money>{monthPredictedTotal}</Money>
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// ============================================================================
// Month View Container
// ============================================================================

interface MonthViewContainerProps {
  monthCursor: Date;
  canGoPrev: boolean;
  canGoNext: boolean;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onSelectDay: (date: string) => void;
}

function MonthViewContainer({
  monthCursor,
  canGoPrev,
  canGoNext,
  onPrevMonth,
  onNextMonth,
  onSelectDay,
}: MonthViewContainerProps) {
  const t = useTranslations('statistics.by_day');
  const { days, totals, isLoading } = useDailyStats(monthCursor);

  return (
    <div className="min-h-screen bg-white -m-4">
      <PageHeader>{t('title')}</PageHeader>

      <MonthNavigation
        monthCursor={monthCursor}
        canGoPrev={canGoPrev}
        canGoNext={canGoNext}
        onPrevMonth={onPrevMonth}
        onNextMonth={onNextMonth}
      />

      <div className="bg-white px-4">
        <div className="grid grid-cols-2 gap-4 pb-2 border-b border-gray-300">
          <div className="text-gray-500 text-sm">{t('labels.date')}</div>
          <div className="text-right text-gray-500 text-sm">
            {t('labels.total_expenses')}
          </div>
        </div>
      </div>

      <div className="bg-white px-4">
        <DaysList
          days={days}
          isLoading={isLoading}
          totalExpenses={totals.expenses}
          monthCursor={monthCursor}
          onSelectDay={onSelectDay}
        />
      </div>
    </div>
  );
}

// ============================================================================
// Custom Hooks
// ============================================================================

function useMonthNavigation(shop: any) {
  const [monthCursor, setMonthCursor] = useState(() =>
    startOfMonth(new Date())
  );

  const todayStart = startOfMonth(new Date());
  const canGoNext = addMonths(monthCursor, 1) <= todayStart;

  const canGoPrev = useMemo(() => {
    if (!shop?.created_at) return true;
    const shopCreated = startOfMonth(new Date(shop.created_at));
    return monthCursor > shopCreated;
  }, [shop?.created_at, monthCursor]);

  const handlePrevMonth = () => setMonthCursor((prev) => addMonths(prev, -1));
  const handleNextMonth = () => setMonthCursor((prev) => addMonths(prev, 1));

  return {
    monthCursor,
    canGoPrev,
    canGoNext,
    handlePrevMonth,
    handleNextMonth,
  };
}

// ============================================================================
// Main Component
// ============================================================================

export function DailyStatsPageNew() {
  useActivateBackButton(fromUrl.toStatistics());

  const { data: shop } = useShop();
  const router = useRouter();

  const {
    monthCursor,
    canGoPrev,
    canGoNext,
    handlePrevMonth,
    handleNextMonth,
  } = useMonthNavigation(shop);

  const handleSelectDay = (date: string) => {
    router.push(fromUrl.toStatisticsDay(date));
  };

  return (
    <FiltersProvider>
      <MonthViewContainer
        monthCursor={monthCursor}
        canGoPrev={canGoPrev}
        canGoNext={canGoNext}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onSelectDay={handleSelectDay}
      />
    </FiltersProvider>
  );
}
