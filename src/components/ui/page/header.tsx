import { FC, HTMLAttributes, PropsWithChildren, ReactNode } from 'react';

import { cn } from '@/lib/utils';

export interface PageHeaderProps extends HTMLAttributes<HTMLDivElement> {
  right?: ReactNode | undefined;
}

export const PageHeader: FC<PropsWithChildren<PageHeaderProps>> = ({
  children,
  right,
  className,
  ...props
}) => {
  return (
    <div
      {...props}
      className={cn(
        'flex justify-between items-center min-h-20 -mt-4 -mx-4 py-2 px-8 border-b bg-primary text-white',
        className
      )}
    >
      <h2 className="flex-1 text-xl text-center font-bold">{children}</h2>
      {right}
    </div>
  );
};

export const PageSubHeader: FC<PropsWithChildren<PageHeaderProps>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      {...props}
      className={cn(
        'flex justify-between items-center min-h-20 -mt-4 -mx-4 py-2 px-8 border-b bg-success text-white',
        className
      )}
    >
      <h2 className="flex-1 text-l text-center font-bold">{children}</h2>
    </div>
  );
};
