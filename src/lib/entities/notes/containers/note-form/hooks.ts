import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { useForm } from '@/lib/composite/form/useForm';
import { createNote } from '@/lib/entities/notes/actions/createNote';
import { updateNote } from '@/lib/entities/notes/actions/updateNote';
import { useNoteById } from '@/lib/entities/notes/hooks/useNoteById';
import { useNotes } from '@/lib/entities/notes/hooks/useNotes';
import { NotePayload, notePayloadSchema } from '@/lib/entities/notes/schema';
import * as fromUrl from '@/lib/url/generator';

const defaultValues = {
  title: '',
  content: '',
};

export function useNoteForm(id?: string) {
  const router = useRouter();
  const t = useTranslations('validation.success');

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

      router.push(fromUrl.toNotes());
    },
    schema: notePayloadSchema,
    successMessage: {
      title: id ? t('saved_title') : t('note_added_title'),
      description: id ? t('saved_description') : t('note_added_description'),
    },
  });
}
