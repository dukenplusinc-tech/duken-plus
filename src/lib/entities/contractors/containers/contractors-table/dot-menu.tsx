import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { EntityImageBtn } from '@/lib/composite/files/entity-image-btn';
import { UploadEntities } from '@/lib/composite/uploads/types';
import { useDeleteContractors } from '@/lib/entities/contractors/hooks/useDeleteContractors';
import type { Contractor } from '@/lib/entities/contractors/schema';
import { useModalDialog } from '@/lib/primitives/modal/hooks';
import * as fromUrl from '@/lib/url/generator';
import { InfoRow } from '@/components/ui/content/dialog';
import type { DropDownButtonOption } from '@/components/ui/ionic/dropdown';

export function useContractorDotMenu(
  contractor: Contractor
): DropDownButtonOption[] {
  const t = useTranslations();
  const router = useRouter();

  const dialog = useModalDialog();

  const handleEdit = useCallback(() => {
    dialog.launch({
      title: contractor.title,
      dialog: true,
      acceptCaption: 'contractors.edit_btn',
      render: (
        <div>
          <InfoRow
            label={t('contractors.form_label_supervisor')}
            value={contractor.supervisor}
          />
          <InfoRow
            label={t('contractors.form_label_supervisor_phone')}
            value={contractor.supervisor_phone}
          />
          <InfoRow
            label={t('contractors.form_label_sales_representative')}
            value={contractor.sales_representative}
          />
          <InfoRow
            label={t('contractors.form_label_sales_representative_phone')}
            value={contractor.sales_representative_phone}
          />
          <InfoRow
            label={t('contractors.form_label_sales_address')}
            value={contractor.address}
          />
          <InfoRow
            label={t('contractors.form_label_contract')}
            value={
              <EntityImageBtn
                id={contractor.id}
                entity={UploadEntities.Contractors}
              />
            }
          />
          <InfoRow
            label={t('contractors.form_label_note')}
            value={contractor.note}
          />
        </div>
      ),
      onAccept: () => {
        router.push(fromUrl.toContractorEdit(contractor.id));
      },
    });
  }, [
    contractor.address,
    contractor.id,
    contractor.note,
    contractor.sales_representative,
    contractor.sales_representative_phone,
    contractor.supervisor,
    contractor.supervisor_phone,
    contractor.title,
    dialog,
    router,
    t,
  ]);

  const handleRemove = useDeleteContractors(contractor.id);

  return useMemo(
    () => [
      {
        label: t('datatable.actions.view_cation'),
        onClick: handleEdit,
      },
      {
        label: t('datatable.actions.delete_cation'),
        onClick: handleRemove.onDelete,
        disabled: handleRemove.processing,
      },
    ],
    [t, handleEdit, handleRemove.onDelete, handleRemove.processing]
  );
}
