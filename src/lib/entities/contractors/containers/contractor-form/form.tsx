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
import { UploadEntities } from '@/lib/composite/uploads/types';
import { PhoneInput } from '@/components/ui/phone-input';

import { useContractorForm } from './hooks';

export const ContractorForm: FC<{ id?: string }> = ({ id }) => {
  const t = useTranslations('contractors');

  const { form, isProcessing, handleSubmit } = useContractorForm(id);

  return (
    <IonList>
      <form onSubmit={handleSubmit}>
        {/* Title Field */}
        <IonItem>
          <IonLabel position="stacked">{t('form_label_title')}</IonLabel>
          <IonInput
            value={form.watch('title')}
            disabled={isProcessing}
            autocapitalize="sentences"
            onIonInput={(e) => form.setValue('title', e.detail.value!)}
            placeholder={t('form_label_title')}
          />
        </IonItem>
        {form.formState.errors.title && (
          <IonLabel color="danger">
            {form.formState.errors.title.message}
          </IonLabel>
        )}

        {/* Supervisor Field */}
        <IonItem>
          <IonLabel position="stacked">{t('form_label_supervisor')}</IonLabel>
          <IonInput
            value={form.watch('supervisor')}
            disabled={isProcessing}
            autocapitalize="sentences"
            onIonInput={(e) => form.setValue('supervisor', e.detail.value!)}
            placeholder={t('form_label_supervisor')}
          />
        </IonItem>
        {form.formState.errors.supervisor && (
          <IonLabel color="danger">
            {form.formState.errors.supervisor.message}
          </IonLabel>
        )}

        {/* Supervisor Phone Field */}
        <PhoneInput
          label={t('form_label_supervisor_phone')}
          placeholder={t('form_label_supervisor_phone')}
          value={form.watch('supervisor_phone')}
          onChange={(value) => {
            form.setValue('supervisor_phone', value || '', {
              shouldValidate: true,
            });
          }}
          onBlur={() => form.trigger('supervisor_phone')}
          disabled={isProcessing}
          error={form.formState.errors.supervisor_phone?.message}
          required={false}
        />

        {/* Sales Representative Field */}
        <IonItem>
          <IonLabel position="stacked">
            {t('form_label_sales_representative')}
          </IonLabel>
          <IonInput
            value={form.watch('sales_representative')}
            disabled={isProcessing}
            autocapitalize="sentences"
            onIonInput={(e) =>
              form.setValue('sales_representative', e.detail.value!)
            }
            placeholder={t('form_label_sales_representative')}
          />
        </IonItem>
        {form.formState.errors.sales_representative && (
          <IonLabel color="danger">
            {form.formState.errors.sales_representative.message}
          </IonLabel>
        )}

        {/* Sales Representative Phone Field */}
        <PhoneInput
          label={t('form_label_sales_representative_phone')}
          placeholder={t('form_label_sales_representative_phone')}
          value={form.watch('sales_representative_phone')}
          onChange={(value) => {
            form.setValue('sales_representative_phone', value || '', {
              shouldValidate: true,
            });
          }}
          onBlur={() => form.trigger('sales_representative_phone')}
          disabled={isProcessing}
          error={form.formState.errors.sales_representative_phone?.message}
          required={false}
        />

        {/* Address Field */}
        <IonItem>
          <IonLabel position="stacked">
            {t('form_label_sales_address')}
          </IonLabel>
          <IonInput
            value={form.watch('address')}
            disabled={isProcessing}
            autocapitalize="sentences"
            onIonInput={(e) => form.setValue('address', e.detail.value!)}
            placeholder={t('form_label_sales_address')}
          />
        </IonItem>
        {form.formState.errors.address && (
          <IonLabel color="danger">
            {form.formState.errors.address.message}
          </IonLabel>
        )}

        {/* Contract Field */}
        <ImageUploader
          id={id}
          entity={UploadEntities.Contractors}
          label={t('form_label_contract')}
        />

        {/* Additional Note Field */}
        <IonItem>
          <IonLabel position="stacked">{t('form_label_note')}</IonLabel>
          <IonTextarea
            value={form.watch('note')}
            disabled={isProcessing}
            autocapitalize="sentences"
            onIonInput={(e) => form.setValue('note', e.detail.value!)}
            placeholder={t('form_label_note_placeholder')}
          />
        </IonItem>
        {form.formState.errors.note && (
          <IonLabel color="danger">
            {form.formState.errors.note.message}
          </IonLabel>
        )}

        {/* Submit Button */}
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
