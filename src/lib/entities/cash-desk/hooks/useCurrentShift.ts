'use client';

import { useMemo } from 'react';
import useSWR from 'swr';

import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/types';

type CashShiftDashboard = Database['public']['Views']['cash_shift_dashboard']['Row'];

interface CurrentShiftData extends CashShiftDashboard {
  shift_number: number;
  opened_at: string;
  closes_at: string;
  closed_at: string | null;
  status: 'open' | 'closed' | 'auto_closed';
  opened_by?: string | null;
  closed_by?: string | null;
}

export const useCurrentShift = () => {
  const supabase = createClient();

  const fetcher = async () => {
    // Get current open shift from dashboard view
    const { data: dashboard, error: dashboardError } = await supabase
      .from('cash_shift_dashboard')
      .select('*')
      .eq('status', 'open')
      .order('opened_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (dashboardError) {
      throw new Error(dashboardError.message);
    }

    if (!dashboard) {
      return null;
    }

    // Get full shift details including user info
    const { data: shift, error: shiftError } = await supabase
      .from('cash_shifts')
      .select('id, shift_number, opened_at, closes_at, closed_at, status, opened_by, closed_by')
      .eq('id', dashboard.shift_id!)
      .single();

    if (shiftError) {
      throw new Error(shiftError.message);
    }

    return {
      ...dashboard,
      ...shift,
    } as CurrentShiftData;
  };

  const { data, error, isLoading, mutate } = useSWR('current-shift', fetcher, {
    refreshInterval: 1000, // Refresh every second for countdown
    revalidateOnFocus: true,
  });

  return useMemo(() => {
    return {
      data,
      error,
      isLoading,
      refresh: () => mutate(),
    };
  }, [data, error, isLoading, mutate]);
};





