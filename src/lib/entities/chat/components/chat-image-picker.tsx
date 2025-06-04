'use client';

import { FC, useCallback } from 'react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { IonButton, IonIcon } from '@ionic/react';
import { cameraOutline, imagesOutline } from 'ionicons/icons';
import { useTranslations } from 'next-intl';

export interface ChatImagePickerProps {
  onImage?: (dataUrl: string) => void;
}

async function resizeDataUrl(
  dataUrl: string,
  maxWidth: number,
  maxHeight: number
) {
  return new Promise<string>((resolve) => {
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;
      const ratio = Math.min(maxWidth / width, maxHeight / height, 1);
      width *= ratio;
      height *= ratio;
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
      }
      resolve(canvas.toDataURL('image/jpeg', 0.9));
    };
    img.src = dataUrl;
  });
}

export const ChatImagePicker: FC<ChatImagePickerProps> = ({ onImage }) => {
  const t = useTranslations('chat');
  const processImage = useCallback(
    async (dataUrl: string) => {
      const resized = await resizeDataUrl(dataUrl, 800, 800);
      onImage?.(resized);
    },
    [onImage]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        processImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    },
    [processImage]
  );

  const takePhoto = useCallback(async () => {
    try {
      const photo = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
      });

      if (photo.dataUrl) {
        await processImage(photo.dataUrl);
      }
    } catch (error) {
      console.error('Error taking photo', error);
    }
  }, [processImage]);

  return (
    <div className="flex space-x-2 p-2">
      <IonButton color="success">
        <label className="m-0 text-white">
          <IonIcon slot="start" icon={imagesOutline} className="mr-1" />
          {t('choose')}
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handleFileChange}
          />
        </label>
      </IonButton>
      <IonButton color="success" onClick={takePhoto}>
        <IonIcon slot="icon-only" icon={cameraOutline} className="text-white" />
      </IonButton>
    </div>
  );
};
