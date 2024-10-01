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

import { useSecuritySettingsForm } from './hooks';

export const SecuritySettingsForm: FC = () => {
  const t = useTranslations('settings');

  const { form, isProcessing, handleSubmit } = useSecuritySettingsForm();

  return (
    <form onSubmit={handleSubmit}>
      <IonList>
        {/* Password Field */}
        <IonItem>
          <IonLabel position="stacked">
            {t('security.form_label_password')}
          </IonLabel>
          <IonInput
            type="password"
            placeholder={t('security.form_placeholder_password')}
            value={form.watch('password')}
            onIonInput={(e) => form.setValue('password', e.detail.value!)}
          />
        </IonItem>
        {form.formState.errors.password && (
          <IonText color="danger">
            <small>{form.formState.errors.password.message}</small>
          </IonText>
        )}

        {/* Confirm Password Field */}
        <IonItem>
          <IonLabel position="stacked">
            {t('security.form_label_password_confirm')}
          </IonLabel>
          <IonInput
            type="password"
            placeholder={t('security.form_placeholder_password_confirm')}
            value={form.watch('password_confirm')}
            onIonInput={(e) =>
              form.setValue('password_confirm', e.detail.value!)
            }
          />
        </IonItem>
        {form.formState.errors.password_confirm && (
          <IonText color="danger">
            <small>{form.formState.errors.password_confirm.message}</small>
          </IonText>
        )}

        {/* Save Button */}
        <div className="ion-padding">
          <IonButton
            expand="block"
            color="success"
            type="submit"
            disabled={isProcessing}
          >
            {t('security.form_save')}
          </IonButton>
        </div>
      </IonList>
    </form>
  );
};
