import { createContext, useContext } from 'react';

export interface UploaderParams {
  uploadID: string;
}

export type UploaderHandler = (
  params: UploaderParams | undefined
) => Promise<void>;

export type CleanUpFn = () => void;

export interface UploadManagerContextType {
  registerUploader: (name: string | any, cb: UploaderHandler | null) => void;
  registerOnUploaded: (
    name: string | any,
    cb: UploaderHandler | null
  ) => CleanUpFn;
  startUpload: (params?: UploaderParams | undefined) => Promise<void>;
  uploading: boolean;
}

export const UploadManagerContext =
  createContext<UploadManagerContextType | null>(null);

export const useUploadContext = () => {
  return useContext(UploadManagerContext)!;
};
