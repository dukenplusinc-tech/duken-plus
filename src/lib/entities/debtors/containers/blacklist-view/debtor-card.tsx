import { FileWarning, LoaderCircle as Spinner, User } from 'lucide-react';

import { useEntityImage } from '@/lib/composite/files/hooks/useEntityImage';
import { UploadEntities } from '@/lib/composite/uploads/types';
import type { Debtor } from '@/lib/entities/debtors/schema';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface DebtorCardProps {
  debtor: Debtor;
  className?: string;
}

export function DebtorCard({ debtor, className }: DebtorCardProps) {
  const { id, iin, full_name } = debtor;

  const { imageUrl, loading } = useEntityImage({
    id,
    entity: UploadEntities.DebtorPhoto,
  });

  const Inner = (
    <div
      className={cn(
        // layout
        'h-full w-full rounded-2xl p-3 sm:p-4',
        'flex flex-col items-center justify-between',
        // visuals
        'bg-card shadow-sm ring-1 ring-muted',
        'hover:shadow-md hover:ring-primary/30 transition-all',
        className
      )}
    >
      {/* Photo */}
      <div className="relative w-full">
        <div className="mx-auto aspect-[4/3] w-full overflow-hidden rounded-xl bg-muted/60">
          {/* Loading shimmer */}
          {loading && (
            <div className="flex h-full w-full items-center justify-center">
              <Spinner className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {/* Avatar / Photo */}
          {!loading && (
            <Avatar className="h-full w-full rounded-none">
              <AvatarImage
                src={imageUrl ?? undefined}
                alt={full_name}
                className="h-full w-full object-cover"
              />
              <AvatarFallback className="h-full w-full rounded-none bg-background/60">
                <User className="mx-auto h-12 w-12 text-muted-foreground" />
              </AvatarFallback>
            </Avatar>
          )}
        </div>

        <div className="absolute right-2 top-2 rounded-full bg-background/80 p-1.5 ring-1 ring-muted">
          <FileWarning className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      {/* Text */}
      <div className="mt-3 w-full text-center">
        <p className="mb-0.5 line-clamp-1 truncate text-base font-semibold text-foreground">
          {full_name}
        </p>
        <p className="font-mono text-sm text-muted-foreground">{iin}</p>
      </div>
    </div>
  );

  return <div className="h-full">{Inner}</div>;
}
