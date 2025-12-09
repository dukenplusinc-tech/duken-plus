import { DayDetailPage } from '@/lib/entities/statistics/containers/day-detail-page';

export default function Page({ params }: { params: { date: string } }) {
    return <DayDetailPage date={params.date} />;
}
