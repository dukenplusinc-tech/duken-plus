'use client';

import { FC } from 'react';
import {
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonText,
} from '@ionic/react';
import { useTranslations } from 'next-intl';

import { useEmployeeForm } from '@/lib/entities/employees/containers/create-employee/hooks';

export const EmployeeForm: FC<{ id?: string }> = ({ id }) => {
  const t = useTranslations('employees.create');
  const { form, isProcessing, handleSubmit } = useEmployeeForm(id);

  return (
    <form onSubmit={handleSubmit}>
      <IonList>
        {/* Full Name Field */}
        <IonItem>
          <IonLabel position="stacked">{t('form_label_full_name')}</IonLabel>
          <IonInput
            placeholder={t('form_placeholder_full_name')}
            value={form.watch('full_name')}
            onIonInput={(e) => form.setValue('full_name', e.detail.value!)}
          />

          {form.formState.errors.full_name && (
            <IonText color="danger">
              <small>{form.formState.errors.full_name.message}</small>
            </IonText>
          )}
          <IonText color="medium">
            <small>{t('form_description_full_name')}</small>
          </IonText>
        </IonItem>

        {/* PIN code Field */}
        <IonItem>
          <IonLabel position="stacked">{t('form_label_pin_code')}</IonLabel>
          <IonInput
            placeholder={t('form_placeholder_pin_code')}
            value={form.watch('pin_code')}
            onIonInput={(e) => form.setValue('pin_code', e.detail.value!)}
          />

          {form.formState.errors.pin_code && (
            <IonText color="danger">
              <small>{form.formState.errors.pin_code.message}</small>
            </IonText>
          )}
          <IonText color="medium">
            <small>{t('form_description_pin_code')}</small>
          </IonText>
        </IonItem>

        {/* Submit Button */}
        <div className="ion-padding">
          <IonButton
            expand="block"
            type="submit"
            color="success"
            disabled={isProcessing}
          >
            {t('form_submit')}
          </IonButton>
        </div>
      </IonList>
    </form>
  );
};
