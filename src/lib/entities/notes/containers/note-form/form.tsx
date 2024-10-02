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

import { useNoteForm } from './hooks';

export const NoteForm: FC<{ id?: string }> = ({ id }) => {
  const { form, isProcessing, handleSubmit } = useNoteForm(id);

  return (
    <IonList>
      <form onSubmit={handleSubmit}>
        {/* Title Field */}
        <IonItem>
          <IonLabel position="stacked">Title</IonLabel>
          <IonInput
            value={form.watch('title')}
            disabled={isProcessing}
            onIonInput={(e) => form.setValue('title', e.detail.value!)} // Update form state
            placeholder="Title"
          />
        </IonItem>
        {form.formState.errors.title && (
          <IonLabel color="danger">
            {form.formState.errors.title.message}
          </IonLabel>
        )}

        {/* Content Field */}
        <IonItem>
          <IonLabel position="stacked">Content</IonLabel>
          <IonTextarea
            value={form.watch('content')}
            onIonInput={(e) => form.setValue('content', e.detail.value!)} // Update form state
            placeholder="Feel free to type your note..."
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
          {isProcessing ? <IonSpinner name="dots" /> : id ? 'Save' : 'Create'}
        </IonButton>
      </form>
    </IonList>
  );
};
