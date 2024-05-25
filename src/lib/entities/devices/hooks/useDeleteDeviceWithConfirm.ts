'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

import { useIssues } from '@/lib/entities/issues/hooks/useIssues';
import { useConfirmDelete } from '@/lib/primitives/dialog/confirm/delete';
import { failedDeleteToast } from '@/lib/primitives/toast/failedDeleteToast';
import { createClient } from '@/lib/supabase/client';
import * as fromUrl from '@/lib/url/generator';
import { toast } from '@/components/ui/use-toast';

export function useDeleteDeviceWithConfirm(id?: string | string[]) {
  const router = useRouter();

  const { refresh } = useIssues();

  const onConfirm = useCallback(
    async (target?: string | string[]) => {
      const supabase = createClient();

      const payload = target || id;
      const ids = Array.isArray(payload) ? payload : [payload];

      const { error } = await supabase.from('devices').delete().in('id', ids);

      if (error) {
        failedDeleteToast(error);

        return;
      }

      toast({
        type: 'foreground',
        title: 'Successful',
        description: 'Successful deleted',
      });

      await refresh();

      router.replace(fromUrl.toDevices());
    },
    [id, refresh, router]
  );

  return useConfirmDelete({
    onConfirm,
  });
}
