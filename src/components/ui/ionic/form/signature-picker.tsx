'use client';

import { FC, useCallback, useRef, useState } from 'react';
import { IonButton, IonItem, IonLabel, IonText } from '@ionic/react';
import { Pencil } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { ImagePreview } from '@/lib/composite/files/image-preview';
import { UploadEntities } from '@/lib/composite/uploads/types';
import { useModalDialog } from '@/lib/primitives/modal/hooks';
import { SignaturePad, SignaturePadType } from '@/components/ui/signature';

export interface SignaturePickerProps {
  entity?: UploadEntities;
  id?: string;
  label?: string;
  onDrawCaptured?: (file: string) => void;
}

export type DrawCapturedHandler = SignaturePickerProps['onDrawCaptured'];

export const SignaturePicker: FC<SignaturePickerProps> = ({
  label,
  onDrawCaptured,
  entity,
  id,
}) => {
  const t = useTranslations('upload.signature');

  const [signature, setSignature] = useState<string | null>(null);

  const canvasRef = useRef<SignaturePadType | null>(null);

  const dialog = useModalDialog();

  const openModal = useCallback(() => {
    dialog.launch({
      dialog: true,
      title: t('modal_title'),
      onAccept: () => {
        if (!canvasRef.current) {
          return;
        }

        const img = canvasRef.current.getTrimmedCanvas().toDataURL('image/png');

        setSignature(img);

        if (onDrawCaptured) {
          onDrawCaptured(img);
        }
      },
      onCancel: () => {
        setSignature(null);
      },
      render: <SignaturePad ref={canvasRef} />,
    });
  }, [t, dialog, onDrawCaptured]);

  return (
    <IonItem>
      <IonLabel position="stacked">{label}</IonLabel>

      <div className="flex w-full space-x-2 mt-4 mb-6 justify-end">
        <div className="flex items-stretch h-[60px] border border-black rounded-lg overflow-hidden bg-white">
          <div className="flex-1 flex items-center px-4 min-w-0">
            {signature ? (
              <img
                src={signature}
                alt="Signature"
                className="max-h-[40px] object-contain"
              />
            ) : (
              !(entity && id) && (
                <IonText color="medium">{t('no_image')}</IonText>
              )
            )}

            {entity && id && <ImagePreview entity={entity} id={id} />}
          </div>
          <div className="w-[60px] border-l border-black bg-[--ion-color-success]">
            <IonButton
              color="success"
              className="w-full h-full m-0 p-0"
              onClick={openModal}
            >
              <Pencil className="text-white h-5 w-5" />
            </IonButton>
          </div>
        </div>
      </div>
    </IonItem>
  );
};
