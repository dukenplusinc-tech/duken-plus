import { FC, PropsWithChildren } from 'react';

export const EmptyScreen: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="flex justify-center items-center flex-1">
      {/* You can add a message or an icon to show that the list is empty */}
      <p style={{ textAlign: 'center' }}>{children || 'No items available'}</p>
    </div>
  );
};
