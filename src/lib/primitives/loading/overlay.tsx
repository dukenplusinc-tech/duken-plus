'use client';

import { Loader2 } from 'lucide-react';
import { useLoading } from './context';

export function LoadingOverlay() {
  const { isLoading } = useLoading();

  if (!isLoading) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm pointer-events-none">
      <div className="flex flex-col items-center gap-4 pointer-events-auto">
        <Loader2 className="h-12 w-12 animate-spin text-white" />
      </div>
    </div>
  );
}

