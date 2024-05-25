'use client';

import {useCallback} from "react";
import {useRouter} from "next/navigation";

import {createClient} from "@/lib/supabase/client";

export function useSignOut() {
  const router = useRouter()

  return useCallback(async () => {
    const supabase = createClient()

    await supabase.auth.signOut();

    router.push('/auth/login')
  }, [router])
}
