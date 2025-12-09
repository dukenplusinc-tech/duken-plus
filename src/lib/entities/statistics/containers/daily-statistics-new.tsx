'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

import { FiltersProvider } from '@/lib/composite/filters/provider';
import { SortButton } from '@/lib/composite/filters/ui/sort-button';
import { useShop } from '@/lib/entities/shop/hooks/useShop';
import { useDailyStats } from '@/lib/entities/statistics/hooks/useDailyStats';
import type { DayBreakdown } from '@/lib/entities/statistics/types';
import { useActivateBackButton } from '@/lib/navigation/back-button/hooks';
import { PageHeader } from '@/components/ui/page/header';
import { Money } from '@/components/numbers/money';

// ============================================================================
// Utility Functions
// ============================================================================

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date: Date, months: number) {
  return new Date(date.getFullYear(), date.getMonth() + months, 1);
}

function formatDayLabel(value: string) {
  const date = new Date(value);
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

// ============================================================================
// Skeleton Components
// ============================================================================

function DayListSkeleton() {
  return (
    <div className="space-y-0">
      {Array.from({ length: 7 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between px-4 py-3 border-b border-gray-200 animate-pulse"
        >
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-32 mb-1" />
          </div>
          <div className="h-4 bg-gray-200 rounded w-24" />
        </div>
      ))}
    </div>
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

interface DaysListProps {
  days: DayBreakdown[];
  isLoading: boolean;
  totalExpenses: number;
  onSelectDay: (date: string) => void;
}

function DaysList({
  days,
  isLoading,
  totalExpenses,
  onSelectDay,
}: DaysListProps) {
  const t = useTranslations('statistics.by_day');

  if (isLoading) {
    return <DayListSkeleton />;
  }

  if (days.length === 0) {
    return (
      <div className="py-12 text-center text-gray-500">
        {t('days_list.empty')}
      </div>
    );
  }

  return (
    <>
      <div>
        {days.map((day) => (
          <div
            key={day.date}
            onClick={() => onSelectDay(day.date)}
            className="grid grid-cols-2 gap-4 py-4 border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer group"
          >
            <div className="text-gray-900 text-base">
              {formatDayLabel(day.date)}
            </div>
            <div className="text-right flex items-center justify-end gap-2">
              <span className="text-gray-900 font-semibold text-base">
                <Money>{day.expensesTotal}</Money>
              </span>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 py-4 bg-green-100 -mx-4 px-4 mt-0">
        <div className="text-gray-900 font-semibold text-base">
          {t('totals.label')}
        </div>
        <div className="text-right">
          <span className="text-gray-900 font-bold text-lg">
            <Money>{totalExpenses}</Money>
          </span>
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
  useActivateBackButton();
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
    router.push(`/statistics/days/${date}`);
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
