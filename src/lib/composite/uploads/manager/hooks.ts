'use client';

import { useCallback } from 'react';

import { uploads } from '@/config/uploads';
import { UploaderHandler } from '@/lib/composite/uploads/manager';
import { UploadEntities } from '@/lib/composite/uploads/types';
import { useShop } from '@/lib/entities/shop/hooks/useShop';
import { useUser } from '@/lib/entities/users/hooks/useUser';
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

export const useUploader = (entity: UploadEntities) => {
  const { data: shop } = useShop()!;
  const user = useUser();

  const prefixUrl = useCallback(
    (path: string) => {
      return `${shop?.id}/${entity}/${path}`;
    },
    [entity, shop?.id]
  );

  const saveFileReference = useCallback(
    async ({
      filePath,
      entityType,
      uploadID,
      uploadedBy,
    }: {
      filePath: string;
      uploadedBy: string | null;
      entityType: UploadEntities;
      uploadID: string | null;
    }) => {
      const { error } = await supabase.from('file_references').insert({
        shop_id: shop?.id,
        entity: entity,
        file_path: filePath,
        uploaded_by: uploadedBy,
        entity_type: entityType,
        upload_id: uploadID,
      });

      if (error) {
        console.error('Error saving file reference:', error.message);
        throw error;
      }
    },
    [entity, shop?.id]
  );

  const uploadFileToSupabase = useCallback(
    async (file: File, uploadID?: string) => {
      const fileName = `${uploadID || 'upload'}-${file.name}`;
      const filePath = prefixUrl(fileName);

      const { data, error } = await supabase.storage
        .from(uploads.bucket_name)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        console.error('Error uploading file to Supabase:', error.message);
        throw error;
      }

      await saveFileReference({
        filePath,
        uploadID: uploadID ?? null,
        uploadedBy: user?.id ?? null,
        entityType: entity,
      });

      return data?.path;
    },
    [entity, prefixUrl, saveFileReference, user?.id]
  );

  const uploadBase64ToSupabase = useCallback(
    async (
      base64: string,
      fileName: string,
      uploadID?: string,
      type?: string
    ) => {
      const decodedFile = atob(base64.split(',')[1]);
      const arrayBuffer = new ArrayBuffer(decodedFile.length);
      const uint8Array = new Uint8Array(arrayBuffer);

      for (let i = 0; i < decodedFile.length; i++) {
        uint8Array[i] = decodedFile.charCodeAt(i);
      }

      const blob = new Blob([uint8Array], { type: type || 'image/jpeg' });
      const uniqueFileName = `${uploadID || 'upload'}-${fileName}`;

      const filePath = prefixUrl(uniqueFileName);

      const { data, error } = await supabase.storage
        .from(uploads.bucket_name)
        .upload(prefixUrl(uniqueFileName), blob, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        console.error('Error uploading Base64 to Supabase:', error.message);
        throw error;
      }

      await saveFileReference({
        filePath,
        uploadID: uploadID ?? null,
        uploadedBy: user?.id ?? null,
        entityType: entity,
      });

      return data?.path;
    },
    [entity, prefixUrl, saveFileReference, user?.id]
  );

  const buildUploaderHandler = useCallback(
    (
      file: File | string,
      isBase64: boolean,
      fileName: string,
      mimeType?: string
    ): UploaderHandler => {
      return async (params) => {
        if (isBase64) {
          await uploadBase64ToSupabase(
            file as string,
            fileName,
            params?.uploadID,
            mimeType
          );
        } else {
          await uploadFileToSupabase(file as File, params?.uploadID);
        }
      };
    },
    [uploadFileToSupabase, uploadBase64ToSupabase]
  );

  return { buildUploaderHandler };
};
