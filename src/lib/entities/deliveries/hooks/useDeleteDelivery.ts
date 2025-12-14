import { useRouter } from 'next/navigation';
import { mutate } from 'swr';

import { useConfirmDelete } from '@/lib/primitives/dialog/confirm/delete';
import { createClient } from '@/lib/supabase/client';

export function useDeleteDelivery(id?: string, nextRoute?: string) {
  const router = useRouter();
  const supabase = createClient();

  return useConfirmDelete({
    onConfirm: async (ids?: string[]) => {
      const targetIds = [ids, id].flat().filter(Boolean) as string[];

      if (targetIds.length === 0) return;

      const { error } = await supabase
        .from('deliveries')
        .delete()
        .in('id', targetIds);

      if (error) {
        console.error('Failed to delete deliveries:', error);
        throw new Error('Ошибка при удалении доставки');
      }

      // Revalidate SWR lists
      await Promise.all([
        mutate(['todayDeliveriesList']),
        mutate(['overdueDeliveriesList']),
      ]);

      if (nextRoute) {
        router.push(nextRoute);
      }
    },
  });
}
