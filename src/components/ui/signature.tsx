import React, { forwardRef } from 'react';
import type SignatureCanvas from 'react-signature-canvas';

const ReactSignatureCanvas = require('react-signature-canvas'); // <-- CJS require

export type SignaturePadType = SignatureCanvas;

export const SignaturePad = forwardRef<SignatureCanvas>((props: any, ref) => {
  return (
    <div className="border border-black rounded-lg bg-white">
      <ReactSignatureCanvas
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
