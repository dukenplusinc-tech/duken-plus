'use client';

import { FC, Fragment } from 'react';
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
            interface="popover" // You can use "popover" or "action-sheet" for better UI
          >
            {cities.map(({ group, list }, idx) => (
              <Fragment key={idx.toString()}>
                {/* Group Label: Add visual separation for group headers */}
                <IonSelectOption
                  disabled
                  style={{ fontWeight: 'bold', color: 'black' }}
                >
                  {group}
                </IonSelectOption>

                {/* City Options */}
                {list.map((option) => (
                  <IonSelectOption key={option.value} value={option.value}>
                    {option.label.length > 30
                      ? `${option.label.substring(0, 27)}...` // Truncate long labels
                      : option.label}
                  </IonSelectOption>
                ))}
              </Fragment>
            ))}
          </IonSelect>
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
