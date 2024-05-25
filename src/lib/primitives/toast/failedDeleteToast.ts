import type {PostgrestError} from "@supabase/supabase-js";

import {toast} from "@/components/ui/use-toast";

export function failedDeleteToast(error: PostgrestError): void {
  toast({
    variant: 'destructive',
    title: 'Unable to delete',
    description: `${error?.code} :: ${error?.message || ''}\n${error?.details || ''}\n${error?.hint || ''}`
  })
}
