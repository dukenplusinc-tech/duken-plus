import { z } from 'zod';

export const noteSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  created_at: z.string().nullable(),
  updated_at: z.string().nullable(),
});

export type Note = z.infer<typeof noteSchema>;

export const notePayloadSchema = z.object({
  title: z.string().min(3),
  content: z.string(),
});

export type NotePayload = z.infer<typeof notePayloadSchema>;
