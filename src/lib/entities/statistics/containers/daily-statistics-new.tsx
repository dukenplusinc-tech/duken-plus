'use client';

import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { PageHeader } from '@/components/ui/page/header';
import { SortButton } from '@/lib/composite/filters/ui/sort-button';
import { FiltersProvider } from '@/lib/composite/filters/provider';
import { useActivateBackButton } from '@/lib/navigation/back-button/hooks';
import { DayBreakdown, useDailyStats } from '@/lib/entities/statistics/hooks/useDailyStats';
import { useShop } from '@/lib/entities/shop/hooks/useShop';

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

function formatWeekday(value: string) {
    const date = new Date(value);
    const weekdays = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'];
    return weekdays[date.getDay()];
}

function formatMoneyValue(amount: number): string {
    return new Intl.NumberFormat('ru-RU', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
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

// ============================================================================
// Skeleton Components
// ============================================================================

function DayListSkeleton() {
    return (
        <div className="space-y-0">
            {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between px-4 py-3 border-b border-gray-200 animate-pulse">
                    <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-32 mb-1" />
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-24" />
                </div>
            ))}
        </div>
    );
}

function DayDetailSkeleton() {
    return (
        <div className="space-y-0">
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="mb-0">
                    <div className="bg-[#0f5463] px-4 py-3 animate-pulse">
                        <div className="h-4 bg-white/20 rounded w-40" />
                    </div>
                    <div className="bg-white px-4 py-4 space-y-2">
                        <div className="h-12 bg-gray-100 rounded" />
                        <div className="h-12 bg-gray-100 rounded" />
                    </div>
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

function MonthNavigation({ monthCursor, canGoPrev, canGoNext, onPrevMonth, onNextMonth }: MonthNavigationProps) {
    const monthLabel = new Intl.DateTimeFormat('ru-RU', {
        month: 'long',
        year: 'numeric',
    }).format(monthCursor);

    return (
        <div className="bg-white px-4 py-4 flex items-center justify-between gap-2">
            <button
                onClick={onPrevMonth}
                disabled={!canGoPrev}
                className="h-[38px] w-[38px] flex items-center justify-center bg-[#0f5463] hover:bg-[#1a6575] disabled:opacity-30 disabled:cursor-not-allowed rounded-lg transition-colors flex-shrink-0"
            >
                <ChevronLeft className="w-5 h-5 text-white" />
            </button>

            <div className="flex-1 flex items-center justify-center h-[38px] bg-gray-50 rounded-lg mx-2">
                <p className="text-gray-900 text-sm font-semibold capitalize">{monthLabel}</p>
            </div>

            <button
                onClick={onNextMonth}
                disabled={!canGoNext}
                className="h-[38px] w-[38px] flex items-center justify-center bg-[#0f5463] hover:bg-[#1a6575] disabled:opacity-30 disabled:cursor-not-allowed rounded-lg transition-colors flex-shrink-0"
            >
                <ChevronRight className="w-5 h-5 text-white" />
            </button>

            <div className="ml-1">
                <SortButton
                    sortByOptions={[
                        { label: 'По дате', value: 'date' },
                        { label: 'По сумме', value: 'amount' },
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

function DaysList({ days, isLoading, totalExpenses, onSelectDay }: DaysListProps) {
    if (isLoading) {
        return <DayListSkeleton />;
    }

    if (days.length === 0) {
        return (
            <div className="py-12 text-center text-gray-500">
                Нет данных за выбранный месяц
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
                                {formatMoneyValue(day.expensesTotal)} тг
                            </span>
                            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-2 gap-4 py-4 bg-green-100 -mx-4 px-4 mt-0">
                <div className="text-gray-900 font-semibold text-base">Общее</div>
                <div className="text-right">
                    <span className="text-gray-900 font-bold text-lg">
                        {formatMoneyValue(totalExpenses)} тг
                    </span>
                </div>
            </div>
        </>
    );
}

// ============================================================================
// Month View Component
// ============================================================================

interface MonthViewProps {
    days: DayBreakdown[];
    isLoading: boolean;
    monthCursor: Date;
    canGoPrev: boolean;
    canGoNext: boolean;
    onPrevMonth: () => void;
    onNextMonth: () => void;
    onSelectDay: (date: string) => void;
    totalExpenses: number;
}

function MonthView({
    days,
    isLoading,
    monthCursor,
    canGoPrev,
    canGoNext,
    onPrevMonth,
    onNextMonth,
    onSelectDay,
    totalExpenses,
}: MonthViewProps) {
    return (
        <div className="min-h-screen bg-white -m-4">
            <PageHeader>Статистика по дням</PageHeader>

            <MonthNavigation
                monthCursor={monthCursor}
                canGoPrev={canGoPrev}
                canGoNext={canGoNext}
                onPrevMonth={onPrevMonth}
                onNextMonth={onNextMonth}
            />

            <div className="bg-white px-4">
                <div className="grid grid-cols-2 gap-4 pb-2 border-b border-gray-300">
                    <div className="text-gray-500 text-sm">Дата</div>
                    <div className="text-right text-gray-500 text-sm">Общая сумма расходов</div>
                </div>
            </div>

            <div className="bg-white px-4">
                <DaysList
                    days={days}
                    isLoading={isLoading}
                    totalExpenses={totalExpenses}
                    onSelectDay={onSelectDay}
                />
            </div>
        </div>
    );
}

// ============================================================================
// Day Section Component
// ============================================================================

interface DaySectionProps {
    title: string;
    children: React.ReactNode;
}

function DaySection({ title, children }: DaySectionProps) {
    return (
        <div className="bg-white mt-0">
            <div className="bg-[#0f5463] text-white px-4 py-3">
                <h2 className="font-semibold text-base">{title}</h2>
            </div>
            {children}
        </div>
    );
}

// ============================================================================
// Accepted Companies Section
// ============================================================================

interface AcceptedCompaniesSectionProps {
    deliveries: DayBreakdown['accepted'];
}

function AcceptedCompaniesSection({ deliveries }: AcceptedCompaniesSectionProps) {
    const total = deliveries.reduce(
        (sum, delivery) => sum + (delivery.amount_received ?? delivery.amount_expected ?? 0),
        0
    );

    return (
        <>
            <div className="grid grid-cols-2 gap-4 px-4 py-2.5 bg-gray-100 text-gray-600 text-sm font-medium">
                <div>Наименование</div>
                <div className="text-right">Сумма</div>
            </div>

            {deliveries.length === 0 ? (
                <div className="px-4 py-8 text-center text-gray-500 text-sm">
                    Нет принятых фирм за этот день
                </div>
            ) : (
                <>
                    {deliveries.map((delivery, index) => {
                        const actual = Number(delivery.amount_received ?? delivery.amount_expected ?? 0);
                        const expected = Number(delivery.amount_expected ?? 0);
                        const showDifference = !!delivery.amount_received && expected !== actual;

                        return (
                            <div key={delivery.id} className="grid grid-cols-2 gap-4 px-4 py-3 border-b border-gray-200">
                                <div>
                                    <p className="text-gray-900 text-base">
                                        {index + 1}. {delivery.contractor_title}
                                    </p>
                                    {showDifference && (
                                        <p className="text-xs text-red-500 line-through mt-0.5">
                                            {formatMoneyValue(expected)} тг
                                        </p>
                                    )}
                                </div>
                                <div className="text-right">
                                    <span className="text-gray-900 font-semibold text-base">
                                        {formatMoneyValue(actual)} тг
                                    </span>
                                </div>
                            </div>
                        );
                    })}

                    <div className="grid grid-cols-2 gap-4 px-4 py-3.5 bg-green-100">
                        <div className="text-gray-900 font-semibold text-base">Общее</div>
                        <div className="text-right">
                            <span className="text-gray-900 font-bold text-base">
                                {formatMoneyValue(total)} тг
                            </span>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

// ============================================================================
// Expenses Section
// ============================================================================

interface ExpensesSectionProps {
    expenses: DayBreakdown['expenses'];
}

function ExpensesSection({ expenses }: ExpensesSectionProps) {
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    return (
        <>
            <div className="grid grid-cols-2 gap-4 px-4 py-2.5 bg-gray-100 text-gray-600 text-sm font-medium">
                <div>Наименование</div>
                <div className="text-right">Сумма</div>
            </div>

            {expenses.length === 0 ? (
                <div className="px-4 py-8 text-center text-gray-500 text-sm">
                    Расходов нет
                </div>
            ) : (
                <>
                    {expenses.map((expense, index) => (
                        <div key={expense.id} className="grid grid-cols-2 gap-4 px-4 py-3 border-b border-gray-200">
                            <div className="text-gray-900 text-base">
                                {index + 1}. {expense.type}
                            </div>
                            <div className="text-right">
                                <span className="text-gray-900 font-semibold text-base">
                                    {formatMoneyValue(expense.amount)} тг
                                </span>
                            </div>
                        </div>
                    ))}

                    <div className="grid grid-cols-2 gap-4 px-4 py-3.5 bg-green-100">
                        <div className="text-gray-900 font-semibold text-base">Общее</div>
                        <div className="text-right">
                            <span className="text-gray-900 font-bold text-base">
                                {formatMoneyValue(total)} тг
                            </span>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

// ============================================================================
// Consignments Section
// ============================================================================

interface ConsignmentsSectionProps {
    consignments: DayBreakdown['consignments'];
    selectedDate: string;
}

function ConsignmentsSection({ consignments, selectedDate }: ConsignmentsSectionProps) {
    const total = consignments.reduce((sum, delivery) => sum + (delivery.amount_expected ?? 0), 0);

    return (
        <>
            <div className="grid grid-cols-4 gap-2 px-4 py-2.5 bg-gray-100 text-gray-600 text-xs font-medium">
                <div>Поставщик</div>
                <div>Дата принятия</div>
                <div>Просрочка</div>
                <div className="text-right">Сумма</div>
            </div>

            {consignments.length === 0 ? (
                <div className="px-4 py-8 text-center text-gray-500 text-sm">
                    Нет консигнаций
                </div>
            ) : (
                <>
                    {consignments.map((delivery, index) => {
                        const delay = getDaysLate(selectedDate, delivery.consignment_due_date);
                        const actual = Number(delivery.amount_expected ?? 0);
                        const acceptedDate = delivery.accepted_date
                            ? new Date(delivery.accepted_date).toLocaleDateString('ru-RU', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                            })
                            : '—';

                        return (
                            <div key={delivery.id} className="border-b border-gray-200">
                                <div className="px-4 py-3">
                                    <p className="text-gray-900 text-sm font-medium mb-1">
                                        {index + 1}. {delivery.contractor_title}
                                    </p>
                                    <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
                                        <div>
                                            <span className="text-red-500 line-through">{formatMoneyValue(actual)} тг</span>
                                        </div>
                                        <div>{formatMoneyValue(actual)} тг</div>
                                    </div>
                                </div>
                                <div className="px-4 pb-3 bg-red-100">
                                    <p className="text-red-700 text-xs font-medium">
                                        Консигнация {formatMoneyValue(actual)} тг до{' '}
                                        {delivery.consignment_due_date
                                            ? new Date(delivery.consignment_due_date).toLocaleDateString('ru-RU', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric',
                                            })
                                            : '—'}
                                    </p>
                                </div>
                            </div>
                        );
                    })}

                    <div className="grid grid-cols-2 gap-4 px-4 py-3.5 bg-green-100">
                        <div className="text-gray-900 font-semibold text-base">Общее</div>
                        <div className="text-right">
                            <span className="text-gray-900 font-bold text-base">
                                {formatMoneyValue(total)} тг
                            </span>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

// ============================================================================
// Not Accepted Section
// ============================================================================

interface NotAcceptedSectionProps {
    deliveries: DayBreakdown['others'];
}

function NotAcceptedSection({ deliveries }: NotAcceptedSectionProps) {
    const tStatus = useTranslations('statistics.delivery.status');
    const total = deliveries.reduce((sum, delivery) => sum + (delivery.amount_expected ?? 0), 0);

    return (
        <>
            <div className="grid grid-cols-3 gap-4 px-4 py-2.5 bg-gray-100 text-gray-600 text-sm font-medium">
                <div>Наименование</div>
                <div>Причина</div>
                <div className="text-right">Сумма</div>
            </div>

            {deliveries.length === 0 ? (
                <div className="px-4 py-8 text-center text-gray-500 text-sm">
                    Все фирмы приняты
                </div>
            ) : (
                <>
                    {deliveries.map((delivery, index) => (
                        <div key={delivery.id} className="grid grid-cols-3 gap-4 px-4 py-3 border-b border-gray-200">
                            <div className="text-gray-900 text-base">
                                {index + 1}. {delivery.contractor_title}
                            </div>
                            <div className="text-gray-600 text-sm">
                                {tStatus(delivery.status as any)}
                            </div>
                            <div className="text-right">
                                <span className="text-gray-900 font-semibold text-base">
                                    {formatMoneyValue(delivery.amount_expected ?? 0)} тг
                                </span>
                            </div>
                        </div>
                    ))}

                    <div className="grid grid-cols-3 gap-4 px-4 py-3.5 bg-green-100">
                        <div className="col-span-2 text-gray-900 font-semibold text-base">Общее</div>
                        <div className="text-right">
                            <span className="text-gray-900 font-bold text-base">
                                {formatMoneyValue(total)} тг
                            </span>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

// ============================================================================
// Day Detail View Component
// ============================================================================

interface DayDetailViewProps {
    day: DayBreakdown | null;
    isLoading: boolean;
    onBack: () => void;
    onPrevDay: () => void;
    onNextDay: () => void;
    canGoPrev: boolean;
    canGoNext: boolean;
}

function DayDetailView({ day, isLoading, onBack, onPrevDay, onNextDay, canGoPrev, canGoNext }: DayDetailViewProps) {
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="bg-[#0f5463]">
                    <div className="flex items-center justify-center pt-4 pb-3">
                        <div className="bg-[#0f5463] border-2 border-white/30 rounded-full px-5 py-1.5">
                            <div className="h-4 w-48 bg-white/20 rounded animate-pulse" />
                        </div>
                    </div>
                    <div className="text-center pt-4 pb-5">
                        <div className="h-6 w-48 bg-white/20 rounded mx-auto animate-pulse" />
                    </div>
                </div>
                <div className="pt-4">
                    <DayDetailSkeleton />
                </div>
            </div>
        );
    }

    if (!day) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-gray-500">Выберите день</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-[#0f5463] text-white">
                <div className="flex items-center justify-between px-4 pt-4 pb-3">
                    <button
                        onClick={onBack}
                        className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6 text-white" />
                    </button>

                    <div className="bg-[#0f5463] border-2 border-white/30 rounded-full px-5 py-1.5">
                        <p className="text-white text-sm font-medium">
                            {formatDayLabel(day.date)}, {formatWeekday(day.date)}
                        </p>
                    </div>

                    <div className="w-10" />
                </div>

                <div className="text-center pt-2 pb-5">
                    <h1 className="text-white text-xl font-semibold tracking-wide">Статистика по дням</h1>
                </div>

                <div className="flex items-center justify-between px-6 pb-4">
                    <button
                        onClick={onPrevDay}
                        disabled={!canGoPrev}
                        className="w-11 h-11 flex items-center justify-center bg-[#0f5463] hover:bg-[#1a6575] disabled:opacity-30 disabled:cursor-not-allowed rounded-lg transition-colors"
                    >
                        <ChevronLeft className="w-7 h-7 text-white" />
                    </button>

                    <div className="flex-1 text-center">
                        <p className="text-white text-base font-medium">{formatDayLabel(day.date)}</p>
                    </div>

                    <button
                        onClick={onNextDay}
                        disabled={!canGoNext}
                        className="w-11 h-11 flex items-center justify-center bg-[#0f5463] hover:bg-[#1a6575] disabled:opacity-30 disabled:cursor-not-allowed rounded-lg transition-colors"
                    >
                        <ChevronRight className="w-7 h-7 text-white" />
                    </button>
                </div>
            </div>

            <div className="space-y-0">
                <DaySection title="Принятые фирмы">
                    <AcceptedCompaniesSection deliveries={day.accepted} />
                </DaySection>

                <DaySection title="Расходы">
                    <ExpensesSection expenses={day.expenses} />
                </DaySection>

                <DaySection title="Оплата по консигнации">
                    <ConsignmentsSection consignments={day.consignments} selectedDate={day.date} />
                </DaySection>

                <DaySection title="Не принятые фирмы">
                    <NotAcceptedSection deliveries={day.others} />
                </DaySection>
            </div>
        </div>
    );
}

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
    const { days, totals, isLoading } = useDailyStats(monthCursor);

    return (
        <MonthView
            days={days}
            isLoading={isLoading}
            monthCursor={monthCursor}
            canGoPrev={canGoPrev}
            canGoNext={canGoNext}
            onPrevMonth={onPrevMonth}
            onNextMonth={onNextMonth}
            onSelectDay={onSelectDay}
            totalExpenses={totals.expenses}
        />
    );
}

function useDayNavigation(days: DayBreakdown[], selectedDate: string | null) {
    const currentDayIndex = useMemo(
        () => days.findIndex((day) => day.date === selectedDate),
        [days, selectedDate]
    );

    const canGoPrevDay = currentDayIndex < days.length - 1;
    const canGoNextDay = currentDayIndex > 0;

    const handlePrevDay = () => {
        if (currentDayIndex < days.length - 1) {
            return days[currentDayIndex + 1].date;
        }
        return null;
    };

    const handleNextDay = () => {
        if (currentDayIndex > 0) {
            return days[currentDayIndex - 1].date;
        }
        return null;
    };

    return { canGoPrevDay, canGoNextDay, handlePrevDay, handleNextDay };
}

function useMonthNavigation(shop: any) {
    const [monthCursor, setMonthCursor] = useState(() => startOfMonth(new Date()));

    const todayStart = startOfMonth(new Date());
    const canGoNext = addMonths(monthCursor, 1) <= todayStart;

    const canGoPrev = useMemo(() => {
        if (!shop?.created_at) return true;
        const shopCreated = startOfMonth(new Date(shop.created_at));
        return monthCursor > shopCreated;
    }, [shop?.created_at, monthCursor]);

    const handlePrevMonth = () => setMonthCursor((prev) => addMonths(prev, -1));
    const handleNextMonth = () => setMonthCursor((prev) => addMonths(prev, 1));

    return { monthCursor, canGoPrev, canGoNext, handlePrevMonth, handleNextMonth };
}

// Day detail container to fetch data outside FiltersProvider
function DayDetailContainer({
    monthCursor,
    selectedDate,
    onBack,
    onPrevDay,
    onNextDay,
    canGoPrevDay,
    canGoNextDay,
}: {
    monthCursor: Date;
    selectedDate: string | null;
    onBack: () => void;
    onPrevDay: () => void;
    onNextDay: () => void;
    canGoPrevDay: boolean;
    canGoNextDay: boolean;
}) {
    const { days, isLoading } = useDailyStats(monthCursor);
    const selectedDay = useMemo(() => days.find((day) => day.date === selectedDate), [days, selectedDate]);

    return (
        <DayDetailView
            day={selectedDay || null}
            isLoading={isLoading}
            onBack={onBack}
            onPrevDay={onPrevDay}
            onNextDay={onNextDay}
            canGoPrev={canGoPrevDay}
            canGoNext={canGoNextDay}
        />
    );
}

export function DailyStatsPageNew() {
    useActivateBackButton();
    const { data: shop } = useShop();
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [view, setView] = useState<'month' | 'day'>('month');

    const { monthCursor, canGoPrev, canGoNext, handlePrevMonth, handleNextMonth } = useMonthNavigation(shop);

    // For day navigation, we need to fetch days to know the indices
    // We'll use a temporary hook call for this
    const { days: daysForNav } = useDailyStats(monthCursor);
    const { canGoPrevDay, canGoNextDay, handlePrevDay, handleNextDay } = useDayNavigation(daysForNav, selectedDate);

    const handleSelectDay = (date: string) => {
        setSelectedDate(date);
        setView('day');
    };

    const handleBack = () => {
        setView('month');
        setSelectedDate(null);
    };

    const onPrevDay = () => {
        const prevDate = handlePrevDay();
        if (prevDate) setSelectedDate(prevDate);
    };

    const onNextDay = () => {
        const nextDate = handleNextDay();
        if (nextDate) setSelectedDate(nextDate);
    };

    if (view === 'month') {
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

    return (
        <FiltersProvider>
            <DayDetailContainer
                monthCursor={monthCursor}
                selectedDate={selectedDate}
                onBack={handleBack}
                onPrevDay={onPrevDay}
                onNextDay={onNextDay}
                canGoPrevDay={canGoPrevDay}
                canGoNextDay={canGoNextDay}
            />
        </FiltersProvider>
    );
}
