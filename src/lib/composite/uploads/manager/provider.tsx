'use client';

import {
  FC,
  PropsWithChildren,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  UploaderHandler,
  UploaderParams,
  UploadManagerContext,
  UploadManagerContextType,
} from './context';

function hashLikeKey(name: any | string): string {
  return JSON.stringify(name);
}

export const UploadManagerProvider: FC<PropsWithChildren> = ({ children }) => {
  const uploadRef = useRef({ uploadLock: false });

  const [uploading, setUploading] = useState(false);

  const inMemory = useRef({
    uploaderMap: {} as Record<any, UploaderHandler>,
    uploadedMap: {} as Record<any, UploaderHandler>,
  });

  const registerUploader = useCallback(
    (name: string | any, cb: UploaderHandler | null) => {
      if (inMemory.current && name) {
        if (cb) {
          inMemory.current.uploaderMap[name] = cb;
        } else {
          delete inMemory.current.uploaderMap[name];
        }
      }
    },
    []
  );

  const registerOnUploaded = useCallback(
    (name: string | any, cb: UploaderHandler | null) => {
      if (inMemory.current && name) {
        const key = hashLikeKey(name);

        if (cb) {
          inMemory.current.uploadedMap[key] = cb;
        } else {
          delete inMemory.current.uploadedMap[key];
        }
      }

      return function cleanUp() {
        const key = hashLikeKey(name);
        delete inMemory.current.uploadedMap[key];
      };
    },
    []
  );

  const startUpload = useCallback(
    async (params?: UploaderParams | undefined) => {
      if (uploadRef.current.uploadLock) {
        return;
      }

      uploadRef.current.uploadLock = true;
      setUploading(true);

      try {
        // run upload queue
        await Promise.all(
          Object.values(inMemory.current.uploaderMap).map((cb: Function) =>
            cb(params)
          )
        );
      } catch (e) {
        // ...
      }

      // let's wait for 500ms
      await new Promise<void>((resolve) => {
        setTimeout(resolve, 500);
      });

      // run listeners after upload
      await Promise.all(
        Object.values(inMemory.current.uploadedMap).map((cb: Function) => cb())
      );

      setUploading(false);
      uploadRef.current.uploadLock = false;
    },
    []
  );

  const ctx: UploadManagerContextType = useMemo(() => {
    return {
      registerUploader,
      registerOnUploaded,
      startUpload,
      uploading,
    };
  }, [registerOnUploaded, registerUploader, startUpload, uploading]);

  return (
    <UploadManagerContext.Provider value={ctx}>
      {children}
    </UploadManagerContext.Provider>
  );
};
