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

import { useNoteForm } from './hooks';

export const NoteForm: FC<{ id?: string }> = ({ id }) => {
  const t = useTranslations('notes.form');
  const { form, isProcessing, handleSubmit } = useNoteForm(id);

  return (
    <IonList>
      <form onSubmit={handleSubmit}>
        {/* Title Field */}
        <IonItem>
          <IonLabel position="stacked">{t('label_title')}</IonLabel>
          <IonInput
            value={form.watch('title')}
            disabled={isProcessing}
            onIonInput={(e) => form.setValue('title', e.detail.value!)} // Update form state
            placeholder={t('placeholder_title')}
          />
        </IonItem>
        {form.formState.errors.title && (
          <IonLabel color="danger">
            {form.formState.errors.title.message}
          </IonLabel>
        )}

        {/* Content Field */}
        <IonItem>
          <IonLabel position="stacked">{t('label_content')}</IonLabel>
          <IonTextarea
            value={form.watch('content')}
            onIonInput={(e) => form.setValue('content', e.detail.value!)} // Update form state
            placeholder={t('placeholder_content')}
            rows={15}
            autoGrow
            disabled={isProcessing}
          />
        </IonItem>
        {form.formState.errors.content && (
          <IonLabel color="danger">
            {form.formState.errors.content.message}
          </IonLabel>
        )}

        {/* Submit Button */}
        <IonButton
          className="mt-2"
          expand="block"
          color="success"
          type="submit"
          disabled={isProcessing}
        >
          {isProcessing ? <IonSpinner name="dots" /> : id ? t('save') : t('create')}
        </IonButton>
      </form>
    </IonList>
  );
};
