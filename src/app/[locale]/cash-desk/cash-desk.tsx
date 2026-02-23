'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowUpDown, Plus, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { DateRange } from 'react-day-picker';

import { openShift } from '@/lib/entities/cash-desk/actions/openShift';
import { useAddCashRegisterEntryForm } from '@/lib/entities/cash-desk/containers/add-cash-register-entry';
import { useAddTransferModal } from '@/lib/entities/cash-desk/containers/add-transfer-modal';
import { useCloseShiftDialog } from '@/lib/entities/cash-desk/containers/close-shift-dialog';
import { ShiftCountdown } from '@/lib/entities/cash-desk/containers/shift-countdown';
import { ShiftDateFilterButton } from '@/lib/entities/cash-desk/containers/shift-date-filter-button';
import { ShiftHistoryList } from '@/lib/entities/cash-desk/containers/shift-history-list';
import { useCurrentShift } from '@/lib/entities/cash-desk/hooks/useCurrentShift';
import { useShiftHistory } from '@/lib/entities/cash-desk/hooks/useShiftHistory';
import { useAddedBy } from '@/lib/entities/debtors/hooks/useAddedBy';
import { useConfirmAction } from '@/lib/primitives/dialog/confirm/confirm';
import { toShiftDetail } from '@/lib/url/generator';
import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

export default function CashRegisterPage() {
  const router = useRouter();
  const tShifts = useTranslations('cash_desk.shifts');
  const handleAddTransaction = useAddCashRegisterEntryForm();
  const openTransferModal = useAddTransferModal();
  const openCloseShiftDialog = useCloseShiftDialog();
  const {
    data: currentShift,
    isLoading: isLoadingShift,
    refresh: refreshShift,
  } = useCurrentShift();
  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [sortAscending, setSortAscending] = useState(false);
  const {
    data: historyData,
    isLoading: isLoadingHistory,
    isRefreshing: isRefreshingHistory,
    refresh: refreshHistory,
  } = useShiftHistory(currentPage, 30, dateRange);
  const addedBy = useAddedBy();
  const [isOpeningShift, setIsOpeningShift] = useState(false);

  const handleOpenShift = async () => {
    setIsOpeningShift(true);
    try {
      await openShift(addedBy);
      refreshShift();
      refreshHistory();
    } catch (error) {
      console.error('Failed to open shift:', error);
      alert(
        error instanceof Error ? error.message : tShifts('error_opening_shift')
      );
    } finally {
      setIsOpeningShift(false);
    }
  };

  const confirmOpenShift = useConfirmAction({
    title: tShifts('confirm_open_shift.title'),
    description: tShifts('confirm_open_shift.description'),
    acceptCaption: tShifts('confirm_open_shift.accept'),
    cancelCaption: tShifts('confirm_open_shift.cancel'),
    onConfirm: async () => {
      await handleOpenShift();
    },
  });

  const confirmCloseShift = useConfirmAction({
    title: tShifts('confirm_close_shift.title'),
    description: tShifts('confirm_close_shift.description'),
    acceptCaption: tShifts('confirm_close_shift.accept'),
    cancelCaption: tShifts('confirm_close_shift.cancel'),
    onConfirm: async () => {
      openCloseShiftDialog();
    },
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleShiftClick = (shift: { shift_id: string | null }) => {
    if (shift.shift_id) {
      router.push(toShiftDetail(shift.shift_id));
    }
  };

  const isShiftOpen = currentShift && currentShift.status === 'open';

  return (
    <main className="flex min-h-screen flex-col">
      <div className="p-2">
        {/* Current Shift Status */}
        {!isLoadingShift && (
          <div className="mb-4">
            {isShiftOpen ? (
              <div>
                <div className="mb-2">
                  <div className="text-lg font-semibold text-red-600 mb-1">
                    {tShifts('shift_open', {
                      number: currentShift.shift_number,
                    })}
                  </div>
                  <ShiftCountdown closesAt={currentShift.closes_at} clockOffset={currentShift.clockOffset} />
                </div>
                <div className="flex gap-2 mb-2">
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white h-16 flex-[2] text-base font-semibold"
                    onClick={() =>
                      openTransferModal({ onSuccess: refreshHistory })
                    }
                  >
                    <Plus className="mr-2 h-6 w-6" /> {tShifts('add_transfer')}
                  </Button>
                  <Button
                    variant="destructive"
                    className="h-16 flex-1 flex flex-col items-center justify-center gap-1 text-base font-semibold"
                    onClick={confirmCloseShift.onAction}
                    disabled={confirmCloseShift.processing}
                    loading={confirmCloseShift.processing}
                  >
                    <X className="h-6 w-6" />
                    <span className="text-xs leading-tight">
                      {tShifts('close_shift')}
                    </span>
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <div className="text-lg font-semibold text-red-600 mb-4">
                  {tShifts('shift_closed')}
                </div>
                <Button
                  className="bg-green-600 hover:bg-green-700 text-white w-full"
                  onClick={confirmOpenShift.onAction}
                  disabled={confirmOpenShift.processing || isOpeningShift}
                  loading={isOpeningShift || confirmOpenShift.processing}
                >
                  {tShifts('open_shift')}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Statistics Section */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">{tShifts('statistics')}</h2>
            <div className="flex gap-2">
              <ShiftDateFilterButton
                onDateChange={(range) => {
                  setDateRange(range);
                  setCurrentPage(1); // Reset to first page when date filter changes
                }}
              />
              <Button
                variant={sortAscending ? 'default' : 'outline'}
                size="icon"
                onClick={() => setSortAscending((prev) => !prev)}
                className={
                  sortAscending
                    ? 'bg-primary hover:bg-primary/90 aspect-square h-[38px] w-[38px]'
                    : 'border-2 border-primary/30 aspect-square h-[38px] w-[38px]'
                }
              >
                <ArrowUpDown className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="mb-4">
            {isLoadingHistory ? (
              <div className="text-center py-4">
                {tShifts('loading_history')}
              </div>
            ) : historyData?.shifts && historyData.shifts.length > 0 ? (
              <>
                <ShiftHistoryList
                  shifts={[...historyData.shifts].sort((a, b) => {
                    const dateA = new Date(a.opened_at).getTime();
                    const dateB = new Date(b.opened_at).getTime();
                    return sortAscending ? dateA - dateB : dateB - dateA;
                  })}
                  onShiftClick={handleShiftClick}
                  isLoading={isRefreshingHistory}
                />

                {/* Pagination */}
                {historyData.totalPages > 1 && (
                  <div className="mt-4">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              if (currentPage > 1) {
                                handlePageChange(currentPage - 1);
                              }
                            }}
                            className={
                              currentPage === 1
                                ? 'pointer-events-none opacity-50'
                                : 'cursor-pointer'
                            }
                          />
                        </PaginationItem>
                        {Array.from(
                          { length: historyData.totalPages },
                          (_, i) => i + 1
                        ).map((page) => (
                          <PaginationItem key={page}>
                            <PaginationLink
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                handlePageChange(page);
                              }}
                              isActive={currentPage === page}
                              className="cursor-pointer"
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                        <PaginationItem>
                          <PaginationNext
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              if (currentPage < historyData.totalPages) {
                                handlePageChange(currentPage + 1);
                              }
                            }}
                            className={
                              currentPage === historyData.totalPages
                                ? 'pointer-events-none opacity-50'
                                : 'cursor-pointer'
                            }
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                {tShifts('no_shifts_data')}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
