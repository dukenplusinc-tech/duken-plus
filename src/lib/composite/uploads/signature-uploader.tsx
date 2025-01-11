import { FC, useCallback, useMemo } from 'react';

import { useUploadContext } from '@/lib/composite/uploads/manager';
import { useUploader } from '@/lib/composite/uploads/manager/hooks';
import { UploadEntities } from '@/lib/composite/uploads/types';
import {
  DrawCapturedHandler,
  SignaturePicker,
} from '@/components/ui/ionic/form/signature-picker';

interface SignatureUploaderProps {
  entity: UploadEntities;
  label?: string;
}

function buildOperationName(...parts: string[]): string {
  return parts.join('_');
}

export const SignatureUploader: FC<SignatureUploaderProps> = ({
  label,
  entity,
}) => {
  const { registerUploader } = useUploadContext();
  const { buildUploaderHandler } = useUploader(entity);

  const operationName = useMemo(
    () => buildOperationName('signature', 'upload', entity),
    [entity]
  );

  const handleDrawCaptured: DrawCapturedHandler = useCallback(
    (uri: string) => {
      const fileName = `signature-${entity}-${new Date().toISOString()}.png`;
      const doUpload = buildUploaderHandler(uri, true, fileName, 'image/png');

      registerUploader(operationName, doUpload);
    },
    [buildUploaderHandler, entity, operationName, registerUploader]
  );

  return <SignaturePicker label={label} onDrawCaptured={handleDrawCaptured} />;
};
