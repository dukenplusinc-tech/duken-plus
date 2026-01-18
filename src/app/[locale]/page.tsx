import { redirect } from 'next/navigation';
import { validateUser } from '@/lib/auth/guard/auth/actions/validateUser';
import { HomeScreen } from '@/lib/entities/home/containers/home-screen';
import { MainLayout } from '@/components/layouts/main.layout';
import * as fromUrl from '@/lib/url/generator';

export default async function Dashboard({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; token_hash?: string; type?: string }>;
}) {
  const params = await searchParams;
  
  // If token parameters are present, redirect to confirm route to handle verification
  if (params.token || params.token_hash) {
    const searchParamsObj = new URLSearchParams();
    if (params.token) searchParamsObj.set('token', params.token);
    if (params.token_hash) searchParamsObj.set('token_hash', params.token_hash);
    if (params.type) searchParamsObj.set('type', params.type);
    searchParamsObj.set('next', fromUrl.toInit());
    redirect(`/auth/confirm?${searchParamsObj.toString()}`);
  }

  await validateUser();

  return (
    <MainLayout>
      <HomeScreen />
    </MainLayout>
  );
}
