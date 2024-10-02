import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { useDeleteNotes } from '@/lib/entities/notes/hooks/useDeleteNotes';
import type { Note } from '@/lib/entities/notes/schema';
import * as fromUrl from '@/lib/url/generator';
import type { DropDownButtonOption } from '@/components/ui/ionic/dropdown';

export function useNoteDotMenu(note: Note): DropDownButtonOption[] {
  const t = useTranslations('datatable.actions');

  const handleRemove = useDeleteNotes(note.id);

  const router = useRouter();

  return useMemo(
    () => [
      {
        label: t('view_cation'),
        onClick: () => router.push(fromUrl.toNoteEdit(note.id)),
      },
      {
        label: t('delete_cation'),
        onClick: handleRemove.onDelete,
        disabled: handleRemove.processing,
      },
    ],
    [handleRemove.onDelete, handleRemove.processing, note.id, router, t]
  );
}
