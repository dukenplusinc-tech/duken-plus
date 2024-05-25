import { Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';

export function SmallSpinner({ className }: { className?: string }) {
  return <Loader2 className={cn(className, 'h-4 w-4 animate-spin')} />;
}
