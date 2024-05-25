import { z } from "zod"

import {deviceSchema} from "@/lib/entities/devices/schema";

export const issueSchema = z.object({
  id: z.string(),
  created_at: z.string(),
  title: z.string().nullable(),
  stack: z.any().nullable(),
  properties: z.any().nullable(),
  ip: z.string().nullable(),
  country: z.string().nullable(),
  url: z.string().nullable(), // proxy URL
  dashboard: z.string().nullable(),
  device: deviceSchema.nullable()
})

export type Issue = z.infer<typeof issueSchema>
