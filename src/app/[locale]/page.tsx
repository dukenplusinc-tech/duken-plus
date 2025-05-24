import { validateUser } from '@/lib/auth/guard/auth/actions/validateUser';
import { HomeScreen } from '@/lib/entities/home/containers/home-screen';
import { MainLayout } from '@/components/layouts/main.layout';

export default async function Dashboard() {
  await validateUser();

  return (
    <MainLayout>
      <HomeScreen />
    </MainLayout>
  );
}
