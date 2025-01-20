import { FC, useCallback, useMemo } from 'react';

import { useUploadContext } from '@/lib/composite/uploads/manager';
import { useUploader } from '@/lib/composite/uploads/manager/hooks';
import { UploadEntities } from '@/lib/composite/uploads/types';
import {
  CameraCapturedHandler,
  FileSelectedHandler,
  ImagePicker,
} from '@/components/ui/ionic/form/image-picker';

interface ImageUploaderProps {
  entity: UploadEntities;
  id?: string;
  label?: string;
}

function buildOperationName(...parts: string[]): string {
  return parts.join('_');
}

export const ImageUploader: FC<ImageUploaderProps> = ({
  label,
  entity,
  id,
}) => {
  const { registerUploader } = useUploadContext();
  const { buildUploaderHandler } = useUploader(entity);

  const operationName = useMemo(
    () => buildOperationName('upload', entity),
    [entity]
  );

  const handleFileChoose: FileSelectedHandler = useCallback(
    (file: File) => {
      const doUpload = buildUploaderHandler(file, false, file.name);

      registerUploader(operationName, doUpload);
    },
    [buildUploaderHandler, operationName, registerUploader]
  );

  const handleCameraCaptured: CameraCapturedHandler = useCallback(
    (uri: string) => {
      const fileName = `${entity}-${new Date().toISOString()}.jpg`;
      const doUpload = buildUploaderHandler(uri, true, fileName);

      registerUploader(operationName, doUpload);
    },
    [buildUploaderHandler, entity, operationName, registerUploader]
  );

  return (
    <ImagePicker
      entity={entity}
      id={id}
      label={label}
      onFileSelected={handleFileChoose}
      onCameraCaptured={handleCameraCaptured}
    />
  );
};
