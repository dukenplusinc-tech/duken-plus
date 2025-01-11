import { useTranslations } from 'next-intl';

import { updateDebtor } from '@/lib/entities/debtors/actions/updateDebtor';
import {
  useBlackListedDebtors,
  useDebtors,
} from '@/lib/entities/debtors/hooks/useDebtors';
import { useConfirmAction } from '@/lib/primitives/dialog/confirm/confirm';

export function useUpdateBlacklistDebtor(id?: string, nextValue?: boolean) {
  const t = useTranslations();

  const { refresh: refreshDebtors } = useDebtors();
  const { refresh: refreshBlacklisted } = useBlackListedDebtors();

  const partial = nextValue ? 'add_to' : 'remove_from';

  return useConfirmAction({
    title: t(`debtors.black_list.${partial}_blacklist_title`),
    description: t(`debtors.black_list.${partial}_blacklist_description`),
    acceptCaption: t(`debtors.black_list.${partial}_blacklist_confirm_caption`),
    cancelCaption: t(`debtors.black_list.${partial}_blacklist_cancel_caption`),
    onConfirm: async (ids) => {
      const singleOrList = id || ids;
      const targets = Array.isArray(singleOrList)
        ? singleOrList
        : [singleOrList];

      if (targets?.length) {
        await Promise.all(
          targets.filter(Boolean).map((targetId) =>
            updateDebtor(targetId!, {
              blacklist: Boolean(nextValue),
            })
          )
        );

        await Promise.all([refreshDebtors, refreshBlacklisted]);
      }
    },
  });
}
