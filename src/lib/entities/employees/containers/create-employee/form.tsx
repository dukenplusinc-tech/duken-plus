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
import { useActivateBackButton } from '@/lib/navigation/back-button/hooks';

export const EmployeeForm: FC<{ id?: string | null }> = ({ id = null }) => {
  const t = useTranslations('employees.create');
  const { form, isProcessing, handleSubmit } = useEmployeeForm(id);

  useActivateBackButton();

  return (
    <form onSubmit={handleSubmit}>
      <IonList>
        {/* Full Name Field */}
        <IonItem>
          <IonLabel position="stacked">{t('form_label_full_name')}</IonLabel>
          <IonInput
            placeholder={t('form_placeholder_full_name')}
            value={form.watch('full_name')}
            autocapitalize="sentences"
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
            type="tel"
            inputmode="numeric"
            pattern="[0-9]*"
            maxlength={4}
            placeholder={t('form_placeholder_pin_code')}
            value={form.watch('pin_code')}
            autocapitalize="off"
            onIonInput={(e) => {
              // Filter to only allow digits and limit to 4 characters
              const value = e.detail.value?.replace(/[^0-9]/g, '').slice(0, 4) || '';
              form.setValue('pin_code', value);
            }}
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
