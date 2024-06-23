import { toast } from '@/components/ui/use-toast';

type Handler = () => void | Promise<void>;

export async function safeInvoke(
  cb: null | undefined | Handler,
  params = { toast: false }
): Promise<void> {
  if (cb) {
    try {
      await cb();
    } catch (e) {
      if (params?.toast) {
        toast({
          type: 'foreground',
          variant: 'destructive',
          title: 'An exception occurred',
          description: (e as any)?.message || String(e),
        });
      }

      console.error('[safeInvoke] handled error', e, { error: e });
    }
  }
}
