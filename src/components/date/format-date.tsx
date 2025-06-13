import { FC, HTMLAttributes } from 'react';

import { useFormattedDate } from '@/lib/composite/date/format/useFormattedDate';

export interface FormatDateProps extends HTMLAttributes<HTMLSpanElement> {
  children: string | null;
  format?: string;
}

export const FormatDate: FC<FormatDateProps> = ({
  children: datetime,
  format,
  ...props
}) => {
  const formatted = useFormattedDate(datetime, format);

  return <span {...props}>{formatted}</span>;
};
