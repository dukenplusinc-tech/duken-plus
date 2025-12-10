'use client';

import { useMemo } from 'react';
import useSWR from 'swr';

import type { CashStats } from '@/lib/entities/cash-desk/schema';
import { useQuery } from '@/lib/supabase/query';
import { useCurrentShift } from '@/lib/entities/cash-desk/hooks/useCurrentShift';
import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/types';

type CashShiftDashboard = Database['public']['Views']['cash_shift_dashboard']['Row'];

export const useCashDeskStat = () => {
  const { data: currentShift } = useCurrentShift();
  const supabase = createClient();

  // If there's an open shift, use shift dashboard data
  const fetcher = async () => {
    if (currentShift?.shift_id) {
      const { data, error } = await supabase
        .from('cash_shift_dashboard')
        .select('shift_id, cash_total, bank_total, closing_banks')
        .eq('shift_id', currentShift.shift_id)
        .maybeSingle();

      if (error) throw error;
      return data;
    }
    return null;
  };

  const { data: shiftData, error: shiftError, isLoading: isLoadingShift, mutate: mutateShift } = useSWR(
    currentShift?.shift_id ? `shift-dashboard-${currentShift.shift_id}` : null,
    fetcher,
    {
      revalidateOnFocus: true,
    }
  );

  // Fallback to old view if no shift
  const { data: oldData, refresh: refreshOld, isLoading: isLoadingOld, error: oldError } = useQuery<CashStats[]>(
    'cash_register_ui_view',
    `
      shop_id,
      total_amount,
      cash_total,
      bank_total,
      banks
    `,
    {
      sort: [],
      allowedFilters: [],
    }
  );

  return useMemo(() => {
    if (currentShift && shiftData) {
      const shift = shiftData;
      const cashTotal = shift.cash_total || 0;
      const bankTotal = shift.bank_total || 0;
      const totalAmount = cashTotal + bankTotal;

      // Convert closing_banks to banks format
      let banks: Array<{ bank_name: string; amount: number }> = [];
      if (shift.closing_banks && typeof shift.closing_banks === 'object') {
        banks = Object.entries(shift.closing_banks as Record<string, number>).map(
          ([bank_name, amount]) => ({ bank_name, amount })
        );
      }

      return {
        data: {
          shop_id: currentShift.shop_id || '',
          total_amount: totalAmount,
          cash_total: cashTotal,
          bank_total: bankTotal,
          banks,
        } as CashStats,
        refresh: async () => {
          // Force revalidation to ensure fresh data
          await mutateShift(undefined, { revalidate: true });
        },
        isLoading: isLoadingShift,
        error: shiftError,
      };
    }

    const prepared = oldData?.length ? oldData[0] : null;

    return {
      data: prepared,
      refresh: refreshOld,
      isLoading: isLoadingOld,
      error: oldError,
    };
  }, [currentShift, shiftData, oldData, isLoadingShift, isLoadingOld, shiftError, oldError, mutateShift, refreshOld]);
};
