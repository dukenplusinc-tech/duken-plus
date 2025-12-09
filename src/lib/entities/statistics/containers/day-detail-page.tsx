'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

import { useActivateBackButton } from '@/lib/navigation/back-button/hooks';
import { useDailyStats } from '@/lib/entities/statistics/hooks/useDailyStats';
import { FiltersProvider } from '@/lib/composite/filters/provider';
import { startOfMonth } from '@/lib/entities/statistics/utils/date';
import { toStatisticsDay } from '@/lib/url/generator';
import { DayHeader } from '@/lib/entities/statistics/components/day-header';
import { DayNavigation } from '@/lib/entities/statistics/components/day-navigation';
import { DaySection } from '@/lib/entities/statistics/components/day-section';
import { AcceptedCompaniesSection } from '@/lib/entities/statistics/components/accepted-companies-section';
import { ExpensesSection } from '@/lib/entities/statistics/components/expenses-section';
import { ConsignmentsSection } from '@/lib/entities/statistics/components/consignments-section';
import { NotAcceptedSection } from '@/lib/entities/statistics/components/not-accepted-section';

export function DayDetailPage({ date }: { date: string }) {
  useActivateBackButton();
  const t = useTranslations('statistics.by_day');
  const router = useRouter();

  const monthCursor = useMemo(() => startOfMonth(new Date(date)), [date]);
  const { days, isLoading } = useDailyStats(monthCursor);

  const currentDayIndex = useMemo(
    () => days.findIndex((day) => day.date === date),
    [days, date]
  );

  const selectedDay = useMemo(() => days.find((day) => day.date === date), [days, date]);

  const canGoPrev = currentDayIndex < days.length - 1;
  const canGoNext = currentDayIndex > 0;

  const handlePrevDay = () => {
    if (canGoPrev) {
      router.push(toStatisticsDay(days[currentDayIndex + 1].date));
    }
  };

  const handleNextDay = () => {
    if (canGoNext) {
      router.push(toStatisticsDay(days[currentDayIndex - 1].date));
    }
  };

  if (isLoading || !selectedDay) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">{t('loading')}</p>
      </div>
    );
  }

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
            <ConsignmentsSection consignments={selectedDay.consignments} selectedDate={selectedDay.date} />
          </DaySection>

          <DaySection title={t('sections.notAccepted')}>
            <NotAcceptedSection deliveries={selectedDay.others} />
          </DaySection>
        </div>
      </div>
    </FiltersProvider>
  );
}
