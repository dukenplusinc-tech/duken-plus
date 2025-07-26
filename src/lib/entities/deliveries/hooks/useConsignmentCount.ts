import useSWR from 'swr';

import { createClient } from '@/lib/supabase/client';

export function useConsignmentCount() {
  const supabase = createClient();

  return useSWR('openConsignmentCount', async () => {
    const { count, error } = await supabase
      .from('deliveries')
      .select('id', { count: 'exact', head: true })
      .eq('is_consignement', true)
      .eq('consignment_status', 'open');

    if (error) {
      console.error('Error fetching consignment count', error);
      return 0;
    }

    return count ?? 0;
  });
}
