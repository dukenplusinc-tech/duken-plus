import { FC } from 'react';

import { EntityImageBtn } from '@/lib/composite/files/entity-image-btn';
import { UploadEntities } from '@/lib/composite/uploads/types';

export interface ImagePreviewProps {
  entity: UploadEntities;
  id?: string;
}

export const ImagePreview: FC<ImagePreviewProps> = ({ id, entity }) => {
  return (
    <>{id && <EntityImageBtn mode="signature" entity={entity} id={id} />}</>
  );
};
