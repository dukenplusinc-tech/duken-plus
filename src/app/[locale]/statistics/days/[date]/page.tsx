import { DayDetailPage } from '@/lib/entities/statistics/containers/day-detail-page';

export default async function Page({ params }: { params: Promise<{ date: string }> }) {
    const { date } = await params;
    return <DayDetailPage date={date} />;
}
