'use client';

import { useState } from 'react';
import { Plus, X, Calendar, Filter } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { DateDisplay } from '@/components/date/date-display';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { useCurrentShift } from '@/lib/entities/cash-desk/hooks/useCurrentShift';
import { useShiftHistory } from '@/lib/entities/cash-desk/hooks/useShiftHistory';
import { openShift } from '@/lib/entities/cash-desk/actions/openShift';
import { ShiftCountdown } from '@/lib/entities/cash-desk/containers/shift-countdown';
import { ShiftHistoryList } from '@/lib/entities/cash-desk/containers/shift-history-list';
import { CloseShiftDialog } from '@/lib/entities/cash-desk/containers/close-shift-dialog';
import { useAddCashRegisterEntryForm } from '@/lib/entities/cash-desk/containers/add-cash-register-entry';
import { CashRegisterType } from '@/lib/entities/cash-desk/schema';
import { useRouter } from 'next/navigation';
import { toShiftDetail } from '@/lib/url/generator';

export default function ShiftManagement() {
  const router = useRouter();
  const t = useTranslations('cash_desk.shifts');
  const { data: currentShift, isLoading: isLoadingShift, refresh: refreshShift } = useCurrentShift();
  const [currentPage, setCurrentPage] = useState(1);
  const { data: historyData, isLoading: isLoadingHistory, refresh: refreshHistory } = useShiftHistory(currentPage, 30);
  const [closeDialogOpen, setCloseDialogOpen] = useState(false);
  const handleAddTransaction = useAddCashRegisterEntryForm();

  const handleShiftClick = (shift: { shift_id: string | null }) => {
    if (shift.shift_id) {
      router.push(toShiftDetail(shift.shift_id));
    }
  };

  const handleOpenShift = async () => {
    try {
      await openShift();
      refreshShift();
      refreshHistory();
    } catch (error) {
      console.error('Failed to open shift:', error);
      alert(error instanceof Error ? error.message : t('error_opening_shift'));
    }
  };

  const handleCloseSuccess = () => {
    refreshShift();
    refreshHistory();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isLoadingShift) {
    return (
      <main className="flex min-h-screen flex-col p-2">
        <div className="text-center">{t('loading')}</div>
      </main>
    );
  }

  const isShiftOpen = currentShift && currentShift.status === 'open';

  return (
    <main className="flex min-h-screen flex-col">
      <div className="p-2">
        {/* Header with date */}
        <div className="flex justify-end mb-4">
          <DateDisplay />
        </div>

        {/* Current Shift Status */}
        <div className="mb-4">
          {isShiftOpen ? (
            <div>
              <div className="mb-2">
                <div className="text-lg font-semibold text-red-600 mb-1">
                  {t('shift_open', { number: currentShift.shift_number })}
                </div>
                <ShiftCountdown closesAt={currentShift.closes_at} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() =>
                    handleAddTransaction({
                      type: CashRegisterType.BANK_TRANSFER,
                    })
                  }
                >
                  <Plus className="mr-1 h-4 w-4" /> {t('add_transfer')}
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setCloseDialogOpen(true)}
                >
                  <X className="mr-1 h-4 w-4" /> {t('close_shift')}
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <div className="text-lg font-semibold text-red-600 mb-4">
                {t('shift_closed')}
              </div>
              <Button
                className="bg-green-600 hover:bg-green-700 text-white w-full"
                onClick={handleOpenShift}
              >
                {t('open_shift')}
              </Button>
            </div>
          )}
        </div>

        {/* Statistics Section */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">{t('statistics')}</h2>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon">
                <Calendar className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {isLoadingHistory ? (
            <div className="text-center py-4">{t('loading_history')}</div>
          ) : historyData?.shifts && historyData.shifts.length > 0 ? (
            <>
              <ShiftHistoryList
                shifts={historyData.shifts}
                onShiftClick={handleShiftClick}
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
                      {Array.from({ length: historyData.totalPages }, (_, i) => i + 1).map((page) => (
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
              {t('no_shifts_data')}
            </div>
          )}
        </div>

        {/* Close Shift Dialog */}
        {isShiftOpen && (
          <CloseShiftDialog
            open={closeDialogOpen}
            onOpenChange={setCloseDialogOpen}
            shiftId={currentShift.id}
            onSuccess={handleCloseSuccess}
          />
        )}
      </div>
    </main>
  );
}

