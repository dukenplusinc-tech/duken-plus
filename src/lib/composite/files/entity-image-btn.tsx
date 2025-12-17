import React from 'react';
import Image from 'next/image';
import { IonSpinner } from '@ionic/react';
import { useTranslations } from 'next-intl';

import { useEntityImage } from '@/lib/composite/files/hooks/useEntityImage';
import { useImageViewer } from '@/lib/composite/image/viewer/context';
import { UploadEntities } from '@/lib/composite/uploads/types';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export interface EntityImageBtnProps {
  entity: UploadEntities;
  id: string;
  mode?: 'button' | 'signature';
}

export const EntityImageBtn: React.FC<EntityImageBtnProps> = ({
  entity,
  id,
  mode = 'button',
}) => {
  const t = useTranslations('files');

  const imageViewer = useImageViewer();
  const { imageUrl, loading, isValidating, error } = useEntityImage({
    entity,
    id,
  });

  if (error) {
    return (
      <span className="flex justify-end items-center h-24 text-red-500">
        {t('error')}: {error.message}
      </span>
    );
  }

  if (mode === 'signature') {
    // Show skeleton while loading (initial load or revalidating without existing image)
    if (loading) {
      return (
        <span className="inline-block">
          <Skeleton className="w-[100px] h-[100px] rounded-md" />
        </span>
      );
    }

    if (!imageUrl) {
      return (
        <span className="flex justify-end items-center h-[100px] text-gray-500">
          {t('no_signature_image')}
        </span>
      );
    }

    return (
      <span 
        className="inline-block cursor-pointer hover:opacity-80 transition-opacity"
        onClick={() => imageViewer.openViewer(imageUrl)}
      >
        <Image width={100} height={100} src={imageUrl} alt="signature" />
      </span>
    );
  }

  // Button mode
  if (loading && !isValidating) {
    return (
      <div className="flex justify-center items-center h-9">
        <IonSpinner name="dots" color="primary" />
      </div>
    );
  }

  if (!imageUrl) {
    return (
      <span className="flex justify-end items-center h-24 text-gray-500">
        {t('no_image')}
      </span>
    );
  }

  return (
    <Button
      size="sm"
      variant="success"
      onClick={() => {
        imageViewer.openViewer(imageUrl);
      }}
    >
      {t('open')}
    </Button>
  );
};
