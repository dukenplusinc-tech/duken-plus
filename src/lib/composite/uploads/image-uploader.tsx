import { FC, useCallback, useMemo, useState } from 'react';

import { useUploadContext } from '@/lib/composite/uploads/manager';
import { useUploader } from '@/lib/composite/uploads/manager/hooks';
import { UploadEntities } from '@/lib/composite/uploads/types';
import {
  CameraCapturedHandler,
  FileSelectedHandler,
  ImagePicker,
} from '@/components/ui/ionic/form/image-picker';
import { compressImage, compressDataUrl } from '@/lib/utils/image-compression';

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
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const operationName = useMemo(
    () => buildOperationName('upload', entity),
    [entity]
  );

  const handleFileChoose: FileSelectedHandler = useCallback(
    async (file: File) => {
      try {
        // Show progress during compression
        setUploadProgress(5);
        
        // Compress the image before uploading
        const compressedFile = await compressImage(file);
        
        // Compression done, reset progress (will show again when upload starts)
        setUploadProgress(null);
        
        // Compression done, now register upload with progress callback
        const doUpload = buildUploaderHandler(
          compressedFile,
          false,
          compressedFile.name,
          undefined,
          (progress) => {
            // Map upload progress (10-100) to overall progress (5-100)
            // Compression is 0-5%, upload is 5-100%
            if (progress === 0) {
              setUploadProgress(null);
            } else {
              const overallProgress = 5 + (progress * 0.95);
              setUploadProgress(overallProgress);
            }
          }
        );

        registerUploader(operationName, doUpload);
      } catch (error) {
        console.error('Error compressing image:', error);
        setUploadProgress(null);
        // Fallback to original file if compression fails
        const doUpload = buildUploaderHandler(
          file,
          false,
          file.name,
          undefined,
          (progress) => {
            if (progress === 0) {
              setUploadProgress(null);
            } else {
              setUploadProgress(progress);
            }
          }
        );
        registerUploader(operationName, doUpload);
      }
    },
    [buildUploaderHandler, operationName, registerUploader]
  );

  const handleCameraCaptured: CameraCapturedHandler = useCallback(
    async (uri: string) => {
      try {
        // Show progress during compression
        setUploadProgress(5);
        
        // Compress the base64 image before uploading
        const compressedDataUrl = await compressDataUrl(uri);
        
        // Compression done, reset progress (will show again when upload starts)
        setUploadProgress(null);
        
        const fileName = `${entity}-${new Date().toISOString()}.jpg`;
        const doUpload = buildUploaderHandler(
          compressedDataUrl,
          true,
          fileName,
          'image/jpeg',
          (progress) => {
            // Map upload progress (10-100) to overall progress (5-100)
            // Compression is 0-5%, upload is 5-100%
            if (progress === 0) {
              setUploadProgress(null);
            } else {
              const overallProgress = 5 + (progress * 0.95);
              setUploadProgress(overallProgress);
            }
          }
        );

        registerUploader(operationName, doUpload);
      } catch (error) {
        console.error('Error compressing image:', error);
        setUploadProgress(null);
        // Fallback to original data URL if compression fails
        const fileName = `${entity}-${new Date().toISOString()}.jpg`;
        const doUpload = buildUploaderHandler(
          uri,
          true,
          fileName,
          undefined,
          (progress) => {
            if (progress === 0) {
              setUploadProgress(null);
            } else {
              setUploadProgress(progress);
            }
          }
        );
        registerUploader(operationName, doUpload);
      }
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
      uploadProgress={uploadProgress}
    />
  );
};
