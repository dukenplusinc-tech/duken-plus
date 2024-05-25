import {redirect} from 'next/navigation'

import {createClient} from '@/lib/supabase/server'

export async function redirectIfGuest() {
  const supabase = createClient()

  const {data, error} = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/auth/login')
  }
}
