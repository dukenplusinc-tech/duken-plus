import Image from 'next/image';
import Link from 'next/link';

import { redirectIfUser } from '@/lib/auth/guard/auth/actions/redirectIfUser';
import { toHome } from '@/lib/url/generator';
import { Button } from '@/components/ui/button';

import { ErrorDescription } from './description';

export default async function ErrorPage() {
  await redirectIfUser();

  return (
    <div className="w-full h-[100vh] lg:grid lg:min-h-[600px] lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <ErrorDescription />
          <div className="grid gap-4">
            <Button asChild variant="outline" className="w-full">
              <Link href={toHome()}>Go Back</Link>
            </Button>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <Image
          src="/placeholder.svg"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
