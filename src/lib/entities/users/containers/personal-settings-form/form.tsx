'use client';

import { FC } from 'react';
import {
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonSelect,
  IonSelectOption,
} from '@ionic/react';
import { useTranslations } from 'next-intl';

import { languages } from '@/config/languages';

import { usePersonalForm } from './hooks';

export const PersonalSettingsForm: FC = () => {
  const t = useTranslations('settings.personal');
  const { form, isProcessing, handleSubmit } = usePersonalForm();

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
        </IonItem>
        {form.formState.errors.full_name && (
          <IonLabel color="danger">
            {form.formState.errors.full_name.message}
          </IonLabel>
        )}

        {/* Email Field */}
        <IonItem>
          <IonLabel position="stacked">{t('form_label_email')}</IonLabel>
          <IonInput
            type="email"
            placeholder={t('form_placeholder_email')}
            value={form.watch('email')}
            onIonInput={(e) => form.setValue('email', e.detail.value!)}
          />
        </IonItem>
        {form.formState.errors.email && (
          <IonLabel color="danger">
            {form.formState.errors.email.message}
          </IonLabel>
        )}

        {/* Phone Field */}
        <IonItem>
          <IonLabel position="stacked">{t('form_label_phone')}</IonLabel>
          <IonInput
            placeholder={t('form_placeholder_phone')}
            value={form.watch('phone')}
            onIonInput={(e) => form.setValue('phone', e.detail.value!)}
          />
        </IonItem>
        {form.formState.errors.phone && (
          <IonLabel color="danger">
            {form.formState.errors.phone.message}
          </IonLabel>
        )}

        {/* Language Select Field */}
        <IonItem>
          <IonLabel position="stacked">{t('form_label_lang')}</IonLabel>
          <IonSelect
            value={form.watch('language')}
            placeholder={t('form_placeholder_lang')}
            onIonChange={(e) => form.setValue('language', e.detail.value!)}
          >
            {languages.map((option) => (
              <IonSelectOption key={option.value} value={option.value}>
                {option.label}
              </IonSelectOption>
            ))}
          </IonSelect>
        </IonItem>
        {form.formState.errors.language && (
          <IonLabel color="danger">
            {form.formState.errors.language.message}
          </IonLabel>
        )}

        {/* Save Button */}
        <div className="ion-padding">
          <IonButton
            expand="block"
            color="success"
            type="submit"
            disabled={isProcessing}
          >
            {t('form_save')}
          </IonButton>
        </div>
      </IonList>
    </form>
  );
};
