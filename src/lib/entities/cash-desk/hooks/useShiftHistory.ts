'use client';

import { useMemo } from 'react';
import useSWR from 'swr';
import type { DateRange } from 'react-day-picker';

import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/types';

type CashShiftDashboard = Database['public']['Views']['cash_shift_dashboard']['Row'];

interface ShiftHistoryItem extends CashShiftDashboard {
  shift_number: number;
  opened_at: string;
  closed_at: string | null;
  status: 'open' | 'closed' | 'auto_closed';
  opened_by?: string | null;
  closed_by?: string | null;
}

export const useShiftHistory = (page: number = 1, limit: number = 30, dateRange?: DateRange) => {
  const supabase = createClient();

  // Helper to format date in local timezone as YYYY-MM-DD
  const formatLocalDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Helper to get start of day in local timezone as UTC ISO string
  const getStartOfDayUTC = (date: Date): string => {
    const localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
    return localDate.toISOString();
  };

  // Helper to get end of day in local timezone as UTC ISO string
  const getEndOfDayUTC = (date: Date): string => {
    const localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
    return localDate.toISOString();
  };

  const fetcher = async () => {
    const offset = (page - 1) * limit;

    // Check if the selected date range includes today
    let isTodayInRange = false;
    if (dateRange?.from) {
      const today = formatLocalDate(new Date());
      const startDate = formatLocalDate(dateRange.from);
      const endDateOnly = dateRange.to 
        ? formatLocalDate(dateRange.to)
        : formatLocalDate(dateRange.from);
      isTodayInRange = startDate <= today && today <= endDateOnly;
    }

    let data: ShiftHistoryItem[] = [];
    let count = 0;

    if (dateRange?.from && isTodayInRange) {
      // If today is in range, we need to include:
      // 1. All open shifts (regardless of opened_at date)
      // 2. Shifts opened in the date range (including closed ones)
      const startDate = getStartOfDayUTC(dateRange.from);
      const endDate = dateRange.to 
        ? getEndOfDayUTC(dateRange.to)
        : getEndOfDayUTC(dateRange.from);

      // Get all open shifts
      const { data: openShifts, error: openError } = await supabase
        .from('cash_shift_dashboard')
        .select('*')
        .eq('status', 'open')
        .order('opened_at', { ascending: false });

      if (openError) {
        throw new Error(openError.message);
      }

      // Get shifts opened in the date range
      const { data: dateShifts, error: dateError, count: dateCount } = await supabase
        .from('cash_shift_dashboard')
        .select('*', { count: 'exact' })
        .gte('opened_at', startDate)
        .lte('opened_at', endDate)
        .order('opened_at', { ascending: false });

      if (dateError) {
        throw new Error(dateError.message);
      }

      // Get user info for all shifts
      const allShiftIds = [
        ...(openShifts || []).map((s: any) => s.shift_id).filter(Boolean),
        ...(dateShifts || []).map((s: any) => s.shift_id).filter(Boolean),
      ];
      const uniqueShiftIds = Array.from(new Set(allShiftIds));

      let shiftUserMap = new Map<string, { opened_by: string | null; closed_by: string | null }>();
      if (uniqueShiftIds.length > 0) {
        const { data: shiftUsers, error: userError } = await supabase
          .from('cash_shifts')
          .select('id, opened_by, closed_by')
          .in('id', uniqueShiftIds);

        if (!userError && shiftUsers) {
          shiftUsers.forEach((shift) => {
            shiftUserMap.set(shift.id, {
              opened_by: shift.opened_by,
              closed_by: shift.closed_by,
            });
          });
        }
      }

      // Combine and deduplicate by shift_id
      const shiftMap = new Map<string, ShiftHistoryItem>();
      (openShifts || []).forEach((shift: any) => {
        if (shift.shift_id) {
          const userInfo = shiftUserMap.get(shift.shift_id);
          shiftMap.set(shift.shift_id, {
            ...shift,
            opened_by: userInfo?.opened_by || null,
            closed_by: userInfo?.closed_by || null,
          } as ShiftHistoryItem);
        }
      });
      (dateShifts || []).forEach((shift: any) => {
        if (shift.shift_id) {
          const userInfo = shiftUserMap.get(shift.shift_id);
          shiftMap.set(shift.shift_id, {
            ...shift,
            opened_by: userInfo?.opened_by || null,
            closed_by: userInfo?.closed_by || null,
          } as ShiftHistoryItem);
        }
      });

      data = Array.from(shiftMap.values()).sort((a, b) => 
        new Date(b.opened_at).getTime() - new Date(a.opened_at).getTime()
      );
      count = shiftMap.size;
    } else if (dateRange?.from) {
      // If today is not in range, just filter by opened_at
      const startDate = getStartOfDayUTC(dateRange.from);
      const endDate = dateRange.to 
        ? getEndOfDayUTC(dateRange.to)
        : getEndOfDayUTC(dateRange.from);

      const { data: dateShifts, error: dateError, count: dateCount } = await supabase
        .from('cash_shift_dashboard')
        .select('*', { count: 'exact' })
        .gte('opened_at', startDate)
        .lte('opened_at', endDate)
        .order('opened_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (dateError) {
        throw new Error(dateError.message);
      }

      // Get user info for shifts
      const shiftIds = (dateShifts || []).map((s: any) => s.shift_id).filter(Boolean);
      let shiftUserMap = new Map<string, { opened_by: string | null; closed_by: string | null }>();
      if (shiftIds.length > 0) {
        const { data: shiftUsers } = await supabase
          .from('cash_shifts')
          .select('id, opened_by, closed_by')
          .in('id', shiftIds);

        if (shiftUsers) {
          shiftUsers.forEach((shift) => {
            shiftUserMap.set(shift.id, {
              opened_by: shift.opened_by,
              closed_by: shift.closed_by,
            });
          });
        }
      }

      data = (dateShifts || []).map((shift: any) => {
        const userInfo = shiftUserMap.get(shift.shift_id);
        return {
          ...shift,
          opened_by: userInfo?.opened_by || null,
          closed_by: userInfo?.closed_by || null,
        } as ShiftHistoryItem;
      });
      count = dateCount || 0;
    } else {
      // No date filter - get all shifts
      const { data: allShifts, error: allError, count: allCount } = await supabase
        .from('cash_shift_dashboard')
        .select('*', { count: 'exact' })
        .order('opened_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (allError) {
        throw new Error(allError.message);
      }

      // Get user info for shifts
      const shiftIds = (allShifts || []).map((s: any) => s.shift_id).filter(Boolean);
      let shiftUserMap = new Map<string, { opened_by: string | null; closed_by: string | null }>();
      if (shiftIds.length > 0) {
        const { data: shiftUsers } = await supabase
          .from('cash_shifts')
          .select('id, opened_by, closed_by')
          .in('id', shiftIds);

        if (shiftUsers) {
          shiftUsers.forEach((shift) => {
            shiftUserMap.set(shift.id, {
              opened_by: shift.opened_by,
              closed_by: shift.closed_by,
            });
          });
        }
      }

      data = (allShifts || []).map((shift: any) => {
        const userInfo = shiftUserMap.get(shift.shift_id);
        return {
          ...shift,
          opened_by: userInfo?.opened_by || null,
          closed_by: userInfo?.closed_by || null,
        } as ShiftHistoryItem;
      });
      count = allCount || 0;
    }

    // Apply pagination for the combined results (when today is in range)
    if (dateRange?.from && isTodayInRange) {
      const start = offset;
      const end = offset + limit;
      data = data.slice(start, end);
    }

    return {
      shifts: data,
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
  };

  const dateKey = dateRange?.from 
    ? `${formatLocalDate(dateRange.from)}-${dateRange.to ? formatLocalDate(dateRange.to) : ''}` 
    : 'no-date';

  const { data, error, isLoading, mutate } = useSWR(
    `shift-history-${page}-${limit}-${dateKey}`,
    fetcher,
    {
      revalidateOnFocus: true,
    }
  );

  return useMemo(() => {
    return {
      data,
      error,
      isLoading,
      refresh: () => mutate(),
    };
  }, [data, error, isLoading, mutate]);
};

