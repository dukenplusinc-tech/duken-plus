import { FC, HTMLAttributes } from 'react';

import { useFormattedDate } from '@/lib/composite/date/format/useFormattedDate';

export interface FormatDateProps extends HTMLAttributes<HTMLSpanElement> {
  children: string | null;
}

export const FormatDate: FC<FormatDateProps> = ({
  children: datetime,
  ...props
}) => {
  const formatted = useFormattedDate(datetime);

  return <span {...props}>{formatted}</span>;
};
