import {useState, useEffect} from 'react'
import type {User} from "@supabase/auth-js";

import {createClient} from "@/lib/supabase/client";

export function useUser(): User | null {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then((response) => {
      setUser(response?.data?.user || null)
    }).catch(() => {
      setUser(null)
    })

    const {data: authListener} = supabase.auth.onAuthStateChange(
      async (_, session) => {
        if (session?.user) {
          setUser(session.user)
        } else {
          setUser(null)
        }
      }
    )

    return () => {
      const sub = authListener?.subscription

      if (sub) {
        sub.unsubscribe()
      }
    }
  }, [])

  return user
}
