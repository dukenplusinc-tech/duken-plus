import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { TriangleAlert as WarningIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { EntityImageBtn } from '@/lib/composite/files/entity-image-btn';
import { UploadEntities } from '@/lib/composite/uploads/types';
import { useTransactionForm } from '@/lib/entities/debtors/containers/transaction-form';
import { useDeleteDebtors } from '@/lib/entities/debtors/hooks/useDeleteDebtors';
import { useUpdateBlacklistDebtor } from '@/lib/entities/debtors/hooks/useToggleBlacklistDebtor';
import type { Debtor } from '@/lib/entities/debtors/schema';
import { useShopID } from '@/lib/entities/shop/hooks/useShop';
import { useModalDialog } from '@/lib/primitives/modal/hooks';
import * as fromUrl from '@/lib/url/generator';
import { InfoRow } from '@/components/ui/content/dialog';
import type { DropDownButtonOption } from '@/components/ui/ionic/dropdown';

export function useDebtorDotMenu(debtor: Debtor): DropDownButtonOption[] {
  const t = useTranslations();
  const router = useRouter();
  const shopId = useShopID();
  const canEdit = shopId === debtor.shop_id;

  const dialog = useModalDialog();

  const handleViewInfo = useCallback(() => {
    dialog.launch({
      title: debtor.full_name,
      dialog: true,
      acceptCaption: canEdit ? 'debtors.edit_btn' : undefined,
      render: (
        <div>
          <InfoRow
            label={t('debtors.form_label_full_name')}
            value={debtor.full_name}
          />
          <InfoRow
            label={
              <span className="inline-flex">
                {debtor.blacklist && (
                  <WarningIcon className="mr-2 text-red-600" />
                )}
                {t('debtors.form_label_iin')}
              </span>
            }
            value={debtor.iin}
          />
          <InfoRow
            phone
            label={t('debtors.form_label_phone')}
            value={debtor.phone}
          />
          <InfoRow
            label={t('debtors.form_label_address')}
            value={debtor.address}
          />
          <InfoRow
            label={t('debtors.form_label_max_amount')}
            value={`${debtor.max_credit_amount} ${t('currency.tenge')}`}
          />
          <InfoRow
            label={t('debtors.form_label_work_place')}
            value={debtor.work_place}
          />
          <InfoRow
            label={t('debtors.form_label_photo')}
            value={
              <EntityImageBtn
                id={debtor.id}
                entity={UploadEntities.DebtorPhoto}
              />
            }
          />
          <InfoRow
            label={t('debtors.form_label_id')}
            value={
              <EntityImageBtn
                id={debtor.id}
                entity={UploadEntities.DebtorPhotoID}
              />
            }
          />
          <InfoRow
            label={t('debtors.form_label_signature')}
            value={
              <EntityImageBtn
                mode="signature"
                id={debtor.id}
                entity={UploadEntities.DebtorSignature}
              />
            }
          />
          <InfoRow
            label={t('contractors.form_label_note')}
            value={debtor.additional_info}
          />
        </div>
      ),
      onAccept: canEdit
        ? () => {
            router.push(fromUrl.toDebtorEdit(debtor.id));
          }
        : undefined,
    });
  }, [
    debtor.additional_info,
    debtor.address,
    debtor.blacklist,
    debtor.full_name,
    debtor.id,
    debtor.iin,
    debtor.max_credit_amount,
    debtor.phone,
    debtor.work_place,
    dialog,
    router,
    t,
    canEdit,
  ]);

  const handleAddTransactionRecord = useTransactionForm({
    debtor_id: debtor.id,
  });

  const handleEdit = useCallback(() => {
    if (canEdit) {
      router.push(fromUrl.toDebtorEdit(debtor.id));
    }
  }, [canEdit, debtor.id, router]);

  const handleViewHistory = useCallback(() => {
    router.push(fromUrl.toDebtorHistory(debtor.id));
  }, [debtor.id, router]);

  const handleRemove = useDeleteDebtors(debtor.id);
  const handleChangeBlackList = useUpdateBlacklistDebtor(
    debtor.id,
    !debtor.blacklist
  );

  return useMemo(
    () => [
      ...([
        debtor.balance < 0 && {
          label: t('debtors.dot_menu.repay_the_full_amount_caption'),
          onClick: () => handleAddTransactionRecord(debtor.balance, true),
        },
      ].filter(Boolean) as never as DropDownButtonOption[]),
      {
        label: t('debtors.dot_menu.add_transaction_record'),
        onClick: () => handleAddTransactionRecord(debtor.balance),
      },
      {
        label: t('debtors.dot_menu.view_info_caption'),
        onClick: handleViewInfo,
      },
      {
        label: t('debtors.dot_menu.view_history_caption'),
        onClick: handleViewHistory,
      },
      {
        label: t(
          debtor.blacklist
            ? 'debtors.dot_menu.remove_from_blacklist_caption'
            : 'debtors.dot_menu.add_to_blacklist_caption'
        ),
        onClick: handleChangeBlackList.onAction,
        disabled: handleChangeBlackList.processing,
      },
      ...(canEdit
        ? ([
            {
              label: t('datatable.actions.edit_caption'),
              onClick: handleEdit,
            },
          ] as DropDownButtonOption[])
        : []),
      {
        label: t('datatable.actions.delete_cation'),
        onClick: handleRemove.onDelete,
        disabled: handleRemove.processing,
      },
    ],
    [
      t,
      debtor.balance,
      debtor.blacklist,
      handleAddTransactionRecord,
      handleViewInfo,
      handleViewHistory,
      handleChangeBlackList.onAction,
      handleChangeBlackList.processing,
      handleEdit,
      canEdit,
      handleRemove.onDelete,
      handleRemove.processing,
    ]
  );
}
