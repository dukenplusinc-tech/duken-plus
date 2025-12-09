export type DeliveryStatus = 'pending' | 'accepted' | 'due' | 'canceled';

export interface DeliveryRow {
  id: string;
  contractor_id: string | null;
  status: DeliveryStatus;
  is_consignement: boolean;
  consignment_status: 'open' | 'closed' | null;
  consignment_due_date: string | null;
  expected_date: string;
  accepted_date: string | null;
  amount_expected: number | null;
  amount_received: number | null;
}

export interface ExpenseRow {
  id: string;
  type: string | null;
  amount: number | null;
  date: string;
}

export interface ContractorRow {
  id: string;
  title: string;
}

export interface DailyDelivery extends DeliveryRow {
  contractor_title: string;
}

export interface DailyExpense {
  id: string;
  type: string;
  amount: number;
  date: string;
}

export interface DayBreakdown {
  date: string;
  expensesTotal: number;
  deliveriesAmountTotal: number;
  deliveriesCount: number;
  accepted: DailyDelivery[];
  others: DailyDelivery[];
  consignments: DailyDelivery[];
  expenses: DailyExpense[];
}

export interface DailyStatsResult {
  days: DayBreakdown[];
  totals: {
    expenses: number;
    deliveriesAmount: number;
  };
}



