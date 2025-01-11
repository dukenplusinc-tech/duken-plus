import React, { forwardRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';

export type SignaturePadType = SignatureCanvas;

export const SignaturePad = forwardRef<SignatureCanvas>((props, ref) => {
  return (
    <div className="border border-black rounded-lg bg-white">
      <SignatureCanvas
        {...props}
        ref={ref}
        canvasProps={{
          className: 'signature-canvas w-full h-[200px]',
        }}
        backgroundColor="white"
      />
    </div>
  );
});

SignaturePad.displayName = 'ForwardedRef(SignaturePad)';
