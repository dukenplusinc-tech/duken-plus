'use client';

import { FC } from 'react';
import {
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonSpinner,
  IonTextarea,
} from '@ionic/react';
import { useTranslations } from 'next-intl';

import { ImageUploader } from '@/lib/composite/uploads/image-uploader';
import { SignatureUploader } from '@/lib/composite/uploads/signature-uploader';
import { UploadEntities } from '@/lib/composite/uploads/types';

import { useDebtorForm } from './hooks';

export const DebtorForm: FC<{ id?: string }> = ({ id }) => {
  const t = useTranslations('debtors');

  const { form, isProcessing, handleSubmit } = useDebtorForm(id);

  return (
    <IonList>
      <form onSubmit={handleSubmit}>
        <IonItem>
          <IonLabel position="stacked">{t('form_label_full_name')}</IonLabel>
          <IonInput
            value={form.watch('full_name')}
            disabled={isProcessing}
            onIonInput={(e) => form.setValue('full_name', e.detail.value!)}
            placeholder={t('form_label_full_name')}
          />
        </IonItem>
        {form.formState.errors.full_name && (
          <IonLabel color="danger">
            {form.formState.errors.full_name.message}
          </IonLabel>
        )}

        <IonItem>
          <IonLabel position="stacked">{t('form_label_iin')}</IonLabel>
          <IonInput
            value={form.watch('iin')}
            disabled={isProcessing}
            onIonInput={(e) => form.setValue('iin', e.detail.value!)}
            placeholder={t('form_label_iin')}
          />
        </IonItem>
        {form.formState.errors.iin && (
          <IonLabel color="danger">
            {form.formState.errors.iin.message}
          </IonLabel>
        )}

        <IonItem>
          <IonLabel position="stacked">{t('form_label_phone')}</IonLabel>
          <IonInput
            value={form.watch('phone')}
            disabled={isProcessing}
            onIonInput={(e) => form.setValue('phone', e.detail.value!)}
            placeholder={t('form_label_phone')}
          />
        </IonItem>
        {form.formState.errors.phone && (
          <IonLabel color="danger">
            {form.formState.errors.phone.message}
          </IonLabel>
        )}

        <IonItem>
          <IonLabel position="stacked">{t('form_label_address')}</IonLabel>
          <IonInput
            value={form.watch('address')}
            disabled={isProcessing}
            onIonInput={(e) => form.setValue('address', e.detail.value!)}
            placeholder={t('form_label_address')}
          />
        </IonItem>
        {form.formState.errors.address && (
          <IonLabel color="danger">
            {form.formState.errors.address.message}
          </IonLabel>
        )}

        <IonItem>
          <IonLabel position="stacked">{t('form_label_max_amount')}</IonLabel>
          <IonInput
            type="number"
            min="1000"
            step="100"
            value={form.watch('max_credit_amount')}
            disabled={isProcessing}
            onIonInput={(e) =>
              form.setValue('max_credit_amount', parseInt(e.detail.value!, 10))
            }
            placeholder={t('form_label_max_amount')}
          />
        </IonItem>
        {form.formState.errors.max_credit_amount && (
          <IonLabel color="danger">
            {form.formState.errors.max_credit_amount.message}
          </IonLabel>
        )}

        <IonItem>
          <IonLabel position="stacked">{t('form_label_work_place')}</IonLabel>
          <IonInput
            value={form.watch('work_place')}
            disabled={isProcessing}
            onIonInput={(e) => form.setValue('work_place', e.detail.value!)}
            placeholder={t('form_label_work_place')}
          />
        </IonItem>
        {form.formState.errors.work_place && (
          <IonLabel color="danger">
            {form.formState.errors.work_place.message}
          </IonLabel>
        )}

        <ImageUploader
          entity={UploadEntities.DebtorPhoto}
          label={t('form_label_photo')}
        />

        <ImageUploader
          entity={UploadEntities.DebtorPhotoID}
          label={t('form_label_id')}
        />

        <SignatureUploader
          entity={UploadEntities.DebtorSignature}
          label={t('form_label_signature')}
        />

        <IonItem>
          <IonLabel position="stacked">{t('form_label_note')}</IonLabel>
          <IonTextarea
            value={form.watch('additional_info')}
            disabled={isProcessing}
            onIonInput={(e) =>
              form.setValue('additional_info', e.detail.value!)
            }
            placeholder={t('form_label_note_placeholder')}
          />
        </IonItem>
        {form.formState.errors.additional_info && (
          <IonLabel color="danger">
            {form.formState.errors.additional_info.message}
          </IonLabel>
        )}

        <IonButton
          className="mt-4"
          expand="block"
          color="success"
          type="submit"
          disabled={isProcessing}
        >
          {isProcessing ? (
            <IonSpinner name="dots" />
          ) : (
            <span className="text-white">{t('form_submit')}</span>
          )}
        </IonButton>
      </form>
    </IonList>
  );
};
