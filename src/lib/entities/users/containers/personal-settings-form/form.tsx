'use client';

import { FC } from 'react';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonSelect,
  IonSelectOption,
} from '@ionic/react';
import { useTranslations } from 'next-intl';

import { languages } from '@/config/languages';
import { PhoneInput } from '@/components/ui/phone-input';
import { useSignOut } from '@/lib/entities/users/hooks/useSignOut';
import { useUser } from '@/lib/entities/users/hooks/useUser';

import { usePersonalForm } from './hooks';

export const UserInfoBlock: FC = () => {
  const t = useTranslations('user_nav');

  const user = useUser();
  const signOut = useSignOut();

  if (!user) {
    return null;
  }

  return (
    <IonCard>
      <IonCardHeader>
        <IonLabel>
          <h2>{user?.email}</h2>
          <p>{user?.aud && t(user?.aud)}</p>
        </IonLabel>
      </IonCardHeader>

      <IonCardContent>
        <IonButton expand="block" color="danger" onClick={signOut}>
          {t('logout')}
        </IonButton>
      </IonCardContent>
    </IonCard>
  );
};

export const PersonalSettingsForm: FC = () => {
  const t = useTranslations('settings.personal');
  const { form, isProcessing, handleSubmit } = usePersonalForm();

  return (
    <>
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
              autocapitalize="off"
              onIonInput={(e) => form.setValue('email', e.detail.value!)}
            />
          </IonItem>
          {form.formState.errors.email && (
            <IonLabel color="danger">
              {form.formState.errors.email.message}
            </IonLabel>
          )}

          {/* Phone Field */}
          <PhoneInput
            label={t('form_label_phone')}
            placeholder={t('form_placeholder_phone')}
            value={form.watch('phone')}
            onChange={(value) => form.setValue('phone', value)}
            disabled={isProcessing}
            error={form.formState.errors.phone?.message}
            required={false}
          />

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

      <UserInfoBlock />
    </>
  );
};
