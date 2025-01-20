'use client';

import { FC, useCallback, useState } from 'react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import {
  IonButton,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonText,
} from '@ionic/react';
import { cameraOutline } from 'ionicons/icons';
import { useTranslations } from 'next-intl';

import { ImagePreview } from '@/lib/composite/files/image-preview';
import { UploadEntities } from '@/lib/composite/uploads/types';

export interface ImagePickerProps {
  entity: UploadEntities;
  id?: string;
  label?: string;
  onFileSelected?: (file: File) => void;
  onCameraCaptured?: (file: string) => void;
}

export type FileSelectedHandler = ImagePickerProps['onFileSelected'];
export type CameraCapturedHandler = ImagePickerProps['onCameraCaptured'];

export const ImagePicker: FC<ImagePickerProps> = ({
  id,
  entity,
  label,
  onFileSelected,
  onCameraCaptured,
}) => {
  const t = useTranslations('upload.images');

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Handle camera input
  const takePicture = useCallback(async () => {
    try {
      const photo = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
      });

      setImagePreview(photo.dataUrl || null); // Preview the captured image

      if (onCameraCaptured) {
        onCameraCaptured(photo.dataUrl as string);
      }
    } catch (error) {
      console.error('Error taking photo', error);
    }
  }, [onCameraCaptured]);

  // Handle file input
  const handleFileChange = useCallback(
    (event: any) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          setImagePreview(reader.result as string); // Preview the uploaded file

          if (onFileSelected) {
            onFileSelected(file); // Pass the file to the parent
          }
        };
        reader.readAsDataURL(file);
      }
    },
    [onFileSelected]
  );

  return (
    <IonItem>
      <IonLabel position="stacked">{label}</IonLabel>
      <div className="flex w-full mt-2 space-x-2 justify-end">
        {/* File input for choosing image from gallery */}
        <IonButton color="success">
          <label className="text-white">
            {t('choose_file')}
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleFileChange}
            />
          </label>
        </IonButton>

        {/* Button to open camera */}
        <IonButton color="success" onClick={takePicture}>
          <IonIcon
            slot="icon-only"
            className="text-white"
            icon={cameraOutline}
          />
        </IonButton>
      </div>

      {/* Image preview */}
      <div className="flex w-full space-x-2 justify-end my-2">
        {imagePreview && (
          <IonImg src={imagePreview} alt="Selected" className="max-w-32" />
        )}

        {!imagePreview && !(entity && id) && (
          <IonText color="medium">{t('no_image')}</IonText>
        )}

        {!imagePreview && entity && id && (
          <ImagePreview entity={entity} id={id} />
        )}
      </div>
    </IonItem>
  );
};
