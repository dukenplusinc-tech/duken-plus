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

import { useCitiesOptions } from '@/lib/entities/cities/hooks/useCitiesOptions';

import { useShopForm } from './hooks';

export const UpdateShopForm: FC = () => {
  const t = useTranslations('settings');
  const { form, isProcessing, handleSubmit } = useShopForm();
  const cities = useCitiesOptions();

  return (
    <form onSubmit={handleSubmit}>
      <IonList>
        {/* Title (Shop Name) Field */}
        <IonItem>
          <IonLabel position="stacked">{t('general.form_label_name')}</IonLabel>
          <IonInput
            placeholder={t('general.form_placeholder_name')}
            value={form.watch('title')}
            onIonInput={(e) => form.setValue('title', e.detail.value!)}
          />
        </IonItem>
        {form.formState.errors.title && (
          <IonText color="danger">
            <small>{form.formState.errors.title.message}</small>
          </IonText>
        )}

        {/* City Select Field */}
        <IonItem>
          <IonLabel position="stacked">{t('general.form_label_city')}</IonLabel>
          <IonSelect
            value={form.watch('city')}
            placeholder={t('general.form_placeholder_city')}
            onIonChange={(e) => form.setValue('city', e.detail.value!)}
          >
            {cities.map(({ group, list }, idx) => (
              <IonSelectOption key={idx.toString()} value={group}>
                <IonLabel>{group}</IonLabel>
                {list.map((option) => (
                  <IonSelectOption key={option.value} value={option.value}>
                    {option.label}
                  </IonSelectOption>
                ))}
              </IonSelectOption>
            ))}
          </IonSelect>
          <IonText>
            <small>{t('general.form_description_city')}</small>
          </IonText>
        </IonItem>
        {form.formState.errors.city && (
          <IonText color="danger">
            <small>{form.formState.errors.city.message}</small>
          </IonText>
        )}

        {/* Address Field */}
        <IonItem>
          <IonLabel position="stacked">
            {t('general.form_label_address')}
          </IonLabel>
          <IonInput
            placeholder={t('general.form_placeholder_address')}
            value={form.watch('address')}
            onIonInput={(e) => form.setValue('address', e.detail.value!)}
          />
        </IonItem>
        {form.formState.errors.address && (
          <IonText color="danger">
            <small>{form.formState.errors.address.message}</small>
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
            {t('general.form_save')}
          </IonButton>
        </div>
      </IonList>
    </form>
  );
};
