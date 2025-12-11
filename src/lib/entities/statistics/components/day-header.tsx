import { formatDayLabel, formatWeekday } from '@/lib/entities/statistics/utils/date';

interface DayHeaderProps {
  date: string;
  title: string;
}

export function DayHeader({ date, title }: DayHeaderProps) {
  return (
    <div className="bg-[#0f5463] text-white px-4 py-3">
      <h1 className="text-white text-xl font-semibold tracking-wide text-center">{title}</h1>
    </div>
  );
}



