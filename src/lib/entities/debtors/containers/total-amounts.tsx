import { useDebtorStats } from '@/lib/entities/debtors/hooks/useDebtorStats';

export function TotalAmounts() {
  const { isLoading, data } = useDebtorStats();

  if (isLoading) {
    return <div>...</div>;
  }

  return (
    <div className="flex flex-col justify-center text-right">
      <p className="text-[#90C088] text-l font-bold">
        {Boolean(data?.total_positive_balance) ? '+' : ''}
        {data?.total_positive_balance}
      </p>
      <p className="text-[#FF8989] text-l font-bold">
        {data?.total_negative_balance}
      </p>
    </div>
  );
}
