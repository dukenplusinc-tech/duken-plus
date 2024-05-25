import {z} from "zod"

import {createClient} from "@/lib/supabase/server";
import {issueSchema} from "@/lib/entities/issues/schema";

export async function getIssues() {
  const supabase = createClient()

  const {data} = await supabase.from('issues').select(`
    id,
    created_at,
    title,
    stack,
    properties,
    ip,
    country,
    url,
    dashboard,
    device:device_id ( id, created_at, device_id, os )
  `)

  return z.array(issueSchema).parse(data || [])
}

export async function getIssueById(id: string) {
  const supabase = createClient();

  const {data} = await supabase
    .from('issues')
    .select(`
    id,
    created_at,
    title,
    stack,
    properties,
    ip,
    country,
    url,
    dashboard,
    device:device_id ( id, created_at, device_id, os )
  `)
    .eq('id', id)
    .single()

  if (!data) {
    return null;
  }

  return issueSchema.parse(data)
}
