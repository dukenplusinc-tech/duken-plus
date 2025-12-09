import { ChevronLeft, ChevronRight } from 'lucide-react';

import { formatDayLabel } from '@/lib/entities/statistics/utils/date';

interface DayNavigationProps {
  date: string;
  canGoPrev: boolean;
  canGoNext: boolean;
  onPrev: () => void;
  onNext: () => void;
}

export function DayNavigation({ date, canGoPrev, canGoNext, onPrev, onNext }: DayNavigationProps) {
  return (
    <div className="bg-white px-4 py-4">
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={onPrev}
          disabled={!canGoPrev}
          className="h-[38px] w-[38px] flex items-center justify-center bg-[#0f5463] hover:bg-[#1a6575] disabled:opacity-30 disabled:cursor-not-allowed rounded-lg transition-colors flex-shrink-0"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>

        <div className="flex-1 flex items-center justify-center h-[38px] bg-gray-50 rounded-lg mx-2">
          <p className="text-gray-900 text-sm font-semibold">{formatDayLabel(date)}</p>
        </div>

        <button
          onClick={onNext}
          disabled={!canGoNext}
          className="h-[38px] w-[38px] flex items-center justify-center bg-[#0f5463] hover:bg-[#1a6575] disabled:opacity-30 disabled:cursor-not-allowed rounded-lg transition-colors flex-shrink-0"
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
}



