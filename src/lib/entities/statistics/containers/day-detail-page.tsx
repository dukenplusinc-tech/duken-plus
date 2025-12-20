'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { FiltersProvider } from '@/lib/composite/filters/provider';
import { AcceptedCompaniesSection } from '@/lib/entities/statistics/components/accepted-companies-section';
import { ConsignmentsSection } from '@/lib/entities/statistics/components/consignments-section';
import { DayHeader } from '@/lib/entities/statistics/components/day-header';
import { DayNavigation } from '@/lib/entities/statistics/components/day-navigation';
import { DaySection } from '@/lib/entities/statistics/components/day-section';
import { ExpensesSection } from '@/lib/entities/statistics/components/expenses-section';
import { NotAcceptedSection } from '@/lib/entities/statistics/components/not-accepted-section';
import { useDailyStats } from '@/lib/entities/statistics/hooks/useDailyStats';
import type { DayBreakdown } from '@/lib/entities/statistics/types';
import {
  getAllDaysInMonth,
  startOfMonth,
  toISODate,
} from '@/lib/entities/statistics/utils/date';
import { useActivateBackButton } from '@/lib/navigation/back-button/hooks';
import { toStatisticsDay, toStatisticsDays } from '@/lib/url/generator';

export function DayDetailPage({ date }: { date: string }) {
  const t = useTranslations('statistics.by_day');
  const router = useRouter();

  useActivateBackButton(toStatisticsDays());

  const monthCursor = useMemo(() => startOfMonth(new Date(date)), [date]);
  const { days: daysWithData } = useDailyStats(monthCursor);

  // Get all days in the month, but filter out future dates
  const allDaysInMonth = useMemo(() => {
    const allDays = getAllDaysInMonth(monthCursor);
    const todayISO = toISODate(new Date());
    
    // Filter out future dates
    return allDays.filter((dateISO) => dateISO <= todayISO);
  }, [monthCursor]);

  // Create a map of days with data for quick lookup
  const daysMap = useMemo(() => {
    const map = new Map<string, DayBreakdown>();
    daysWithData.forEach((day) => {
      map.set(day.date, day);
    });
    return map;
  }, [daysWithData]);

  // Find the current day index in all days of the month
  const currentDayIndex = useMemo(
    () => allDaysInMonth.findIndex((dayDate) => dayDate === date),
    [allDaysInMonth, date]
  );

  // Get or create the selected day (with data if available, or empty if not)
  const selectedDay = useMemo(() => {
    const existingDay = daysMap.get(date);
    if (existingDay) {
      return existingDay;
    }
    // Create empty day breakdown for days without data
    return {
      date,
      expensesTotal: 0,
      deliveriesAmountTotal: 0,
      deliveriesCount: 0,
      accepted: [],
      others: [],
      consignments: [],
      expenses: [],
    };
  }, [date, daysMap]);

  // Navigation is based on all days in the month, not just days with data
  const canGoPrev = currentDayIndex > 0;
  const canGoNext = currentDayIndex < allDaysInMonth.length - 1;

  const handlePrevDay = () => {
    if (canGoPrev && currentDayIndex >= 0) {
      const prevDate = allDaysInMonth[currentDayIndex - 1];
      router.push(toStatisticsDay(prevDate));
    }
  };

  const handleNextDay = () => {
    if (canGoNext && currentDayIndex >= 0) {
      const nextDate = allDaysInMonth[currentDayIndex + 1];
      router.push(toStatisticsDay(nextDate));
    }
  };

  return (
    <FiltersProvider>
      <div className="min-h-screen bg-gray-50 -m-4">
        <DayHeader date={selectedDay.date} title={t('title')} />

        <DayNavigation
          date={selectedDay.date}
          canGoPrev={canGoPrev}
          canGoNext={canGoNext}
          onPrev={handlePrevDay}
          onNext={handleNextDay}
        />

        <div className="space-y-0">
          <DaySection title={t('sections.accepted')}>
            <AcceptedCompaniesSection deliveries={selectedDay.accepted} />
          </DaySection>

          <DaySection title={t('sections.expenses')}>
            <ExpensesSection expenses={selectedDay.expenses} />
          </DaySection>

          <DaySection title={t('sections.consignments')}>
            <ConsignmentsSection
              consignments={selectedDay.consignments}
              selectedDate={selectedDay.date}
            />
          </DaySection>

          <DaySection title={t('sections.notAccepted')}>
            <NotAcceptedSection deliveries={selectedDay.others} />
          </DaySection>
        </div>
      </div>
    </FiltersProvider>
  );
}
