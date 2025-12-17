'use client';

import { FC, useCallback, useEffect, useState } from 'react';
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
import { Progress } from '@/components/ui/progress';

export interface ImagePickerProps {
  entity: UploadEntities;
  id?: string;
  label?: string;
  onFileSelected?: (file: File) => void;
  onCameraCaptured?: (file: string) => void;
  uploadProgress?: number | null;
}

export type FileSelectedHandler = ImagePickerProps['onFileSelected'];
export type CameraCapturedHandler = ImagePickerProps['onCameraCaptured'];

export const ImagePicker: FC<ImagePickerProps> = ({
  id,
  entity,
  label,
  onFileSelected,
  onCameraCaptured,
  uploadProgress,
}) => {
  const t = useTranslations('upload.images');

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadReached100, setUploadReached100] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Clear local preview only after upload actually completes (reaches 100%)
  // We track when upload reaches 100% and then clear after progress is reset
  useEffect(() => {
    // Track when upload reaches 100% (completed)
    if (uploadProgress && uploadProgress >= 100) {
      setUploadReached100(true);
    }

    // Only clear preview if upload reached 100% AND progress is now cleared
    // This ensures we don't clear during compression (when progress might be null temporarily)
    if (uploadReached100 && (uploadProgress === null || uploadProgress === 0)) {
      // Upload completed, clear local preview after a short delay
      // to ensure server image is ready and SWR cache is invalidated
      const timeoutId = setTimeout(() => {
        setImagePreview(null);
        setUploadReached100(false);
        // Force ImagePreview to refresh by changing the key
        setRefreshKey((prev) => prev + 1);
      }, 600);

      return () => clearTimeout(timeoutId);
    }
  }, [uploadProgress, uploadReached100]);

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
          <ImagePreview key={`${entity}-${id}-${refreshKey}`} entity={entity} id={id} />
        )}
      </div>

      {/* Upload progress bar */}
      {uploadProgress !== null &&
        uploadProgress !== undefined &&
        uploadProgress > 0 && (
          <div className="w-full mt-2">
            <Progress value={uploadProgress} className="w-full" />
            <IonText className="text-xs text-gray-500 mt-1 block text-right">
              {Math.round(uploadProgress)}%
            </IonText>
          </div>
        )}
    </IonItem>
  );
};
