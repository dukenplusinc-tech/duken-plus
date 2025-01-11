import useSWR from 'swr';

import { uploads } from '@/config/uploads';
import { UploadEntities } from '@/lib/composite/uploads/types';
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

interface UseEntityImageOptions {
  entity: UploadEntities;
  id: string;
}

export const useEntityImage = ({ entity, id }: UseEntityImageOptions) => {
  const fetchFileReference = async () => {
    // Query the file_references table
    const { data, error } = await supabase
      .from('file_references') // Replace with your actual table name
      .select('file_path') // Replace with the column name for file path
      .eq('entity', entity) // Filter by entity
      .eq('upload_id', id) // Filter by specific entity ID
      .limit(1) // Limit to one result
      .maybeSingle(); // Allow the result to be null if no row exists

    if (error) {
      // no rows found
      if (error?.code === 'PGRST116') {
        return null;
      }

      throw new Error(`File reference not found: ${error.message}`);
    }

    if (!data || !data.file_path) {
      return null;
    }

    // Generate signed URL for the file
    const { data: signedUrlData, error: signedUrlError } =
      await supabase.storage
        .from(uploads.bucket_name)
        .createSignedUrl(data.file_path, 3600); // Signed URL valid for 1 hour

    if (signedUrlError) {
      throw new Error(`Error generating signed URL: ${signedUrlError.message}`);
    }

    return signedUrlData.signedUrl;
  };

  const {
    data: imageUrl,
    error,
    isValidating,
  } = useSWR(
    id ? `${entity}-${id}` : null, // Key for SWR
    fetchFileReference,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      refreshInterval: 60_000,
    }
  );

  return { imageUrl, loading: isValidating, isValidating, error };
};
