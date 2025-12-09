interface DaySectionProps {
  title: string;
  children: React.ReactNode;
}

export function DaySection({ title, children }: DaySectionProps) {
  return (
    <div className="bg-white mt-0">
      <div className="bg-[#0f5463] text-white px-4 py-3">
        <h2 className="font-semibold text-base">{title}</h2>
      </div>
      {children}
    </div>
  );
}



