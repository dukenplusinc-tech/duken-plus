import React from 'react';
import Image from 'next/image';
import { IonSpinner } from '@ionic/react';
import { useTranslations } from 'next-intl';

import { useEntityImage } from '@/lib/composite/files/hooks/useEntityImage';
import { useImageViewer } from '@/lib/composite/image/viewer/context';
import { UploadEntities } from '@/lib/composite/uploads/types';
import { Button } from '@/components/ui/button';

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

  if (loading && !isValidating) {
    return (
      <div className="flex justify-center items-center h-9">
        <IonSpinner name="dots" color="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <span className="flex justify-end items-center h-24 text-red-500">
        {t('error')}: {error.message}
      </span>
    );
  }

  if (!imageUrl) {
    return (
      <span className="flex justify-end items-center h-24 text-gray-500">
        {t(mode === 'signature' ? 'no_signature_image' : 'no_image')}
      </span>
    );
  }

  if (mode === 'signature') {
    return (
      <span className="inline-block">
        <Image width={100} height={100} src={imageUrl} alt="signature" />
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
