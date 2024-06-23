import { useForm } from '@/lib/composite/form/useForm';
import { createNote } from '@/lib/entities/notes/actions/createNote';
import { updateNote } from '@/lib/entities/notes/actions/updateNote';
import { useNoteById } from '@/lib/entities/notes/hooks/useNoteById';
import { useNotes } from '@/lib/entities/notes/hooks/useNotes';
import { NotePayload, notePayloadSchema } from '@/lib/entities/notes/schema';

const defaultValues = {
  title: '',
  content: '',
};

export function useNoteForm(id?: string) {
  const { refresh } = useNotes();

  const noteById = useNoteById(id);

  return useForm<typeof notePayloadSchema, NotePayload>({
    defaultValues,
    fetcher: noteById,
    request: async (values) => {
      if (id) {
        await updateNote(id, values);
      } else {
        await createNote(values);
      }

      await refresh();
    },
    schema: notePayloadSchema,
  });
}
