import { useMemo, useCallback } from 'react';
import { useQuery } from '@supabase-cache-helpers/postgrest-swr';

import { createClient } from '@/lib/supabase/client';
import { getAccountingDate } from '@/lib/entities/deliveries/utils/date';

/**
 * Hook to calculate expense info total that matches what's displayed in ExpenseInfo component.
 * This ensures the total matches the sum of all displayed items.
 */
export const useExpenseInfo = (date: string) => {
  const supabase = createClient();

  const { data: expensesData = [] } = useQuery(
    supabase
      .from('expenses')
      .select('*')
      .gte('date', `${date}T00:00:00`)
      .lt('date', `${date}T23:59:59.999`),
    { revalidateOnFocus: false }
  );

  const { data: deliveriesData = [] } = useQuery(
    supabase
      .from('deliveries')
      .select('*, contractors ( title )')
      .in('status', ['pending', 'accepted'])
      .or(`expected_date.eq.${date},and(status.eq.accepted,accepted_date.eq.${date})`),
    { revalidateOnFocus: false }
  );

  const expenses = useMemo(() => expensesData || [], [expensesData]);
  
  // Filter deliveries by accounting date (use accepted_date for overdue accepted)
  const deliveries = useMemo(() => {
    if (!deliveriesData) return [];
    return deliveriesData.filter((d) => {
      const accountingDate = getAccountingDate(d);
      return accountingDate === date;
    });
  }, [deliveriesData, date]);

  // Helper to get the display amount for a delivery
  // If amount_received exists and differs from amount_expected, use amount_received
  // Otherwise use amount_expected
  const getDeliveryAmount = useCallback(
    (d: { amount_received?: number | null; amount_expected?: number | null }) => {
      if (
        d.amount_received != null &&
        d.amount_expected != null &&
        Number(d.amount_received) !== Number(d.amount_expected)
      ) {
        return Number(d.amount_received);
      }
      return Number(d.amount_expected || 0);
    },
    []
  );

  // Calculate total that matches what's displayed:
  // - All expenses (using amount)
  // - All deliveries shown (pending + accepted) using the same logic as display
  const total = useMemo(() => {
    const expenseSum = expenses.reduce(
      (acc, e) => acc + Number(e.amount || 0),
      0
    );

    // Use the same logic as display: amount_received if different, otherwise amount_expected
    const deliverySum = deliveries.reduce(
      (acc, d) => acc + getDeliveryAmount(d),
      0
    );

    return expenseSum + deliverySum;
  }, [expenses, deliveries, getDeliveryAmount]);

  // Add helper function to returned values so component can use it
  return {
    expenses,
    deliveries,
    total,
    getDeliveryAmount,
  };
};
