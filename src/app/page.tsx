import { redirectIfGuest } from '@/lib/auth/guard/auth/actions/redirectIfGuest';
import { DateRangeFilter } from '@/lib/composite/date/date-range-filter';
// import { AnalyticsDashboardCards } from '@/lib/entities/analytics/containers/dashboard-cards';
// import { DashboardOverview } from '@/lib/entities/analytics/containers/dashboard-overview';
import { MainLayout } from '@/components/layouts/main.layout';

export default async function Dashboard() {
  await redirectIfGuest();

  return (
    <MainLayout>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
          <DateRangeFilter />
        </div>
        <div className="space-y-4">
          <div className="space-y-4">
            <p>TODO: AnalyticsDashboardCards</p>
            {/*<AnalyticsDashboardCards />*/}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
