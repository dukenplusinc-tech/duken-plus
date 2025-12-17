'use client';

import { useCallback } from 'react';
import { mutate } from 'swr';

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

  const deleteOldFileReferences = useCallback(
    async (uploadID: string | null, entityType: UploadEntities) => {
      if (!uploadID || !shop?.id) {
        console.log('Skipping deleteOldFileReferences: uploadID or shop.id missing', { uploadID, shopId: shop?.id });
        return;
      }

      try {
        // Find old file references for this entity and uploadID
        // Note: entity and entity_type should be the same, but we check both to be safe
        const { data: oldReferences, error: queryError } = await supabase
          .from('file_references')
          .select('file_path, id')
          .eq('shop_id', shop.id)
          .eq('entity', entity)
          .eq('upload_id', uploadID);

        if (queryError) {
          console.error('Error querying old file references:', queryError.message);
          return;
        }

        console.log('Found old file references to delete:', oldReferences?.length || 0, { entity, uploadID });

        if (oldReferences && oldReferences.length > 0) {
          // Delete old files from storage
          const filePaths = oldReferences.map((ref) => ref.file_path);
          console.log('Deleting old files from storage:', filePaths);
          
          const { error: removeError } = await supabase.storage
            .from(uploads.bucket_name)
            .remove(filePaths);
          
          if (removeError) {
            console.error('Error removing old files from storage:', removeError.message);
          } else {
            console.log('Successfully removed old files from storage');
          }

          // Delete old file references
          const ids = oldReferences.map((ref) => ref.id);
          const { error: deleteError } = await supabase
            .from('file_references')
            .delete()
            .in('id', ids);
          
          if (deleteError) {
            console.error('Error deleting old file references:', deleteError.message);
          } else {
            console.log('Successfully deleted old file references');
          }
        }
      } catch (error) {
        console.error('Error in deleteOldFileReferences:', error);
      }
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
    async (
      file: File,
      uploadID?: string,
      onProgress?: (progress: number) => void
    ) => {
      // Generate unique filename with timestamp to avoid conflicts
      const timestamp = Date.now();
      const randomSuffix = Math.random().toString(36).substring(2, 9);
      const fileExtension = file.name.split('.').pop() || 'jpg';
      const baseName = file.name.replace(/\.[^/.]+$/, '') || 'image';
      const fileName = `${uploadID || 'upload'}-${baseName}-${timestamp}-${randomSuffix}.${fileExtension}`;
      const filePath = prefixUrl(fileName);

      // Delete old files if updating an existing entity
      if (uploadID) {
        await deleteOldFileReferences(uploadID, entity);
      }

      // Simulate progress if callback provided
      if (onProgress) {
        // Start at 10% (compression is done)
        onProgress(10);
        
        let currentProgress = 10;
        
        // Simulate progress during upload
        const progressInterval = setInterval(() => {
          currentProgress = Math.min(currentProgress + 10, 90);
          onProgress(currentProgress);
        }, 200);
        
        try {
          const { data, error } = await supabase.storage
            .from(uploads.bucket_name)
            .upload(filePath, file, {
              cacheControl: '3600',
              upsert: true, // Allow replacing existing files
            });

          clearInterval(progressInterval);
          
          if (error) {
            console.error('Error uploading file to Supabase:', error.message);
            onProgress(0);
            throw error;
          }

          onProgress(100);
          
          await saveFileReference({
            filePath,
            uploadID: uploadID ?? null,
            uploadedBy: user?.id ?? null,
            entityType: entity,
          });

          // Invalidate SWR cache to refresh image preview
          if (uploadID) {
            mutate(`${entity}-${uploadID}`, undefined, { revalidate: true });
          }

          // Small delay to show 100% before clearing
          setTimeout(() => {
            onProgress(0);
          }, 500);

          return data?.path;
        } catch (error) {
          clearInterval(progressInterval);
          onProgress(0);
          throw error;
        }
      }

      // Regular upload without progress
      const { data, error } = await supabase.storage
        .from(uploads.bucket_name)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true, // Allow replacing existing files
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

      // Invalidate SWR cache to refresh image preview
      if (uploadID) {
        mutate(`${entity}-${uploadID}`);
      }

      return data?.path;
    },
    [entity, prefixUrl, saveFileReference, user?.id, deleteOldFileReferences]
  );

  const uploadBase64ToSupabase = useCallback(
    async (
      base64: string,
      fileName: string,
      uploadID?: string,
      type?: string,
      onProgress?: (progress: number) => void
    ) => {
      try {
        // Extract base64 data (handle both data URL format and plain base64)
        let base64Data: string;
        if (base64.includes(',')) {
          base64Data = base64.split(',')[1];
        } else {
          base64Data = base64;
        }

        const decodedFile = atob(base64Data);
        const arrayBuffer = new ArrayBuffer(decodedFile.length);
        const uint8Array = new Uint8Array(arrayBuffer);

        for (let i = 0; i < decodedFile.length; i++) {
          uint8Array[i] = decodedFile.charCodeAt(i);
        }

        const blob = new Blob([uint8Array], { type: type || 'image/jpeg' });
        
        // Generate unique filename with timestamp to avoid conflicts
        const timestamp = Date.now();
        const randomSuffix = Math.random().toString(36).substring(2, 9);
        const fileExtension = fileName.split('.').pop() || 'jpg';
        const baseName = fileName.replace(/\.[^/.]+$/, '') || 'image';
        const uniqueFileName = `${uploadID || 'upload'}-${baseName}-${timestamp}-${randomSuffix}.${fileExtension}`;
        const filePath = prefixUrl(uniqueFileName);

        // Delete old files if updating an existing entity
        if (uploadID) {
          await deleteOldFileReferences(uploadID, entity);
        }

        // Convert blob to File for consistent handling (use unique filename)
        const file = new File([blob], uniqueFileName, { type: type || 'image/jpeg' });

      // Simulate progress if callback provided
      if (onProgress) {
        // Start at 10% (compression is done)
        onProgress(10);
        
        let currentProgress = 10;
        
        // Simulate progress during upload
        const progressInterval = setInterval(() => {
          currentProgress = Math.min(currentProgress + 10, 90);
          onProgress(currentProgress);
        }, 200);
        
        try {
          const { data, error } = await supabase.storage
            .from(uploads.bucket_name)
            .upload(filePath, file, {
              cacheControl: '3600',
              upsert: true, // Allow replacing existing files
            });

          clearInterval(progressInterval);
          
          if (error) {
            console.error('Error uploading Base64 to Supabase:', error.message);
            onProgress(0);
            throw error;
          }

          onProgress(100);
          
          await saveFileReference({
            filePath,
            uploadID: uploadID ?? null,
            uploadedBy: user?.id ?? null,
            entityType: entity,
          });

          // Invalidate SWR cache to refresh image preview
          if (uploadID) {
            mutate(`${entity}-${uploadID}`, undefined, { revalidate: true });
          }

          // Small delay to show 100% before clearing
          setTimeout(() => {
            onProgress(0);
          }, 500);

          return data?.path;
        } catch (error) {
          clearInterval(progressInterval);
          onProgress(0);
          throw error;
        }
      }

        // Regular upload without progress
        const { data, error } = await supabase.storage
          .from(uploads.bucket_name)
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true, // Allow replacing existing files
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

        // Invalidate SWR cache to refresh image preview
        if (uploadID) {
          mutate(`${entity}-${uploadID}`);
        }

        return data?.path;
      } catch (error) {
        console.error('Error in uploadBase64ToSupabase:', error);
        throw error;
      }
    },
    [entity, prefixUrl, saveFileReference, user?.id, deleteOldFileReferences]
  );

  const buildUploaderHandler = useCallback(
    (
      file: File | string,
      isBase64: boolean,
      fileName: string,
      mimeType?: string,
      onProgress?: (progress: number) => void
    ): UploaderHandler => {
      return async (params) => {
        if (isBase64) {
          await uploadBase64ToSupabase(
            file as string,
            fileName,
            params?.uploadID,
            mimeType,
            onProgress
          );
        } else {
          await uploadFileToSupabase(
            file as File,
            params?.uploadID,
            onProgress
          );
        }
      };
    },
    [uploadFileToSupabase, uploadBase64ToSupabase]
  );

  return { buildUploaderHandler };
};
