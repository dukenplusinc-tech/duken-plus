import { Clock } from 'lucide-react';

interface ConsignmentProps {
  count: number;
}

export default function Consignment({ count }: ConsignmentProps) {
  return (
    <div className="mx-2 mt-4 mb-4 bg-success text-success-foreground p-4 rounded-md flex items-center justify-between">
      <div className="flex items-center">
        <Clock size={32} className="mr-3" />
        <span className="text-2xl">Консигнация</span>
      </div>
      <div className="bg-white text-black font-bold text-2xl px-3 py-1 rounded">
        {count}
      </div>
    </div>
  );
}
