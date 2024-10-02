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
  IonText,
} from '@ionic/react';
import { useTranslations } from 'next-intl';

import { useUserForm } from '@/lib/entities/users/containers/create-user/hooks';
import { useRoleOptions } from '@/lib/entities/users/hooks/useRoleOptions';

export const UserForm: FC<{ id?: string }> = ({ id }) => {
  const t = useTranslations('users.invite');
  const { form, isProcessing, handleSubmit } = useUserForm(id);
  const roles = useRoleOptions();

  return (
    <form onSubmit={handleSubmit}>
      <IonList>
        {/* Email Field */}
        <IonItem>
          <IonLabel position="stacked">{t('form_label_email')}</IonLabel>
          <IonInput
            placeholder={t('form_placeholder_email')}
            value={form.watch('email')}
            onIonInput={(e) => form.setValue('email', e.detail.value!)}
          />
        </IonItem>
        {form.formState.errors.email && (
          <IonText color="danger">
            <small>{form.formState.errors.email.message}</small>
          </IonText>
        )}
        <IonText color="medium">
          <small>{t('form_description_email')}</small>
        </IonText>

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
          <IonText color="danger">
            <small>{form.formState.errors.full_name.message}</small>
          </IonText>
        )}
        <IonText color="medium">
          <small>{t('form_description_full_name')}</small>
        </IonText>

        {/* Role Select Field */}
        <IonItem>
          <IonLabel position="stacked">{t('form_label_role')}</IonLabel>
          <IonSelect
            value={form.watch('role_id')}
            placeholder={t('form_placeholder_role')}
            onIonChange={(e) => form.setValue('role_id', e.detail.value!)}
          >
            {roles.map((role) => (
              <IonSelectOption key={role.value} value={role.value.toString()}>
                {role.label}
              </IonSelectOption>
            ))}
          </IonSelect>
        </IonItem>
        {form.formState.errors.role_id && (
          <IonText color="danger">
            <small>{form.formState.errors.role_id.message}</small>
          </IonText>
        )}
        <IonText color="medium">
          <small>{t('form_description_role')}</small>
        </IonText>

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
