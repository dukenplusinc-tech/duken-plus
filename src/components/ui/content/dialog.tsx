import { FC, ReactNode } from 'react';

interface InfoRowProps {
  label: string | ReactNode;
  value: string | ReactNode;
}

export const InfoRow: FC<InfoRowProps> = ({ label, value }) => {
  return (
    <div className="flex justify-between items-start py-2">
      <span className="w-1/2 text-gray-700 text-lg flex justify-start">
        {label}:
      </span>
      <span className="w-1/2  text-gray-900 text-lg text-right">
        {typeof value === 'string' ? (
          <span className="font-bold">{value}</span>
        ) : (
          value
        )}
      </span>
    </div>
  );
};
