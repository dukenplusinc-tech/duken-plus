import { useQuery } from '@supabase-cache-helpers/postgrest-swr';

import { createClient } from '@/lib/supabase/client';
import { Database } from '@/lib/supabase/types';
import { toDateStringTZ } from '@/lib/utils/tz';

const supabase = createClient();

type Delivery = Database['public']['Tables']['deliveries']['Row'];
type Contractor = Database['public']['Tables']['contractors']['Row'];

export type DeliveryWithContractor = Omit<Delivery, 'contractor_id'> & {
  contractor_id: string;
  created_at: string;
  contractors: Pick<Contractor, 'title'> | null;
};

export function useCalendarDeliveries(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth(); // 0-based

  const startDate = toDateStringTZ(new Date(year, month, 1));
  const endDate = toDateStringTZ(new Date(year, month + 1, 0));

  return useQuery<DeliveryWithContractor[]>(
    // @ts-ignore
    supabase
      .from('deliveries')
      .select(
        'id, expected_date, accepted_date, status, is_consignement, amount_expected, amount_received, contractor_id, contractors ( title ), created_at'
      )
      .or(
        `status.eq.pending,status.eq.accepted,status.eq.due,is_consignement.eq.true`
      )
      .or(
        `and(expected_date.gte.${startDate},expected_date.lte.${endDate}),and(status.eq.accepted,accepted_date.gte.${startDate},accepted_date.lte.${endDate})`
      )
      .order('created_at', { ascending: true }),
    {
      revalidateOnFocus: false,
    }
  );
}
