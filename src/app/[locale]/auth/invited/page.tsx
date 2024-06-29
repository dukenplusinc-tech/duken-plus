'use server';

import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

import { SetPasswordForm } from './form';

export default async function ConfirmPage() {
  const t = await getTranslations('invited');

  return (
    <div className="w-full h-[100vh] lg:grid lg:min-h-[600px] lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">{t('title')}</h1>
            <p className="text-balance text-muted-foreground">
              {t('subtitle')}
            </p>
          </div>
          <SetPasswordForm />
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
