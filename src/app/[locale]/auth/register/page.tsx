import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

import { redirectIfUser } from '@/lib/auth/guard/auth/actions/redirectIfUser';
import { RegisterForm } from '@/app/auth/register/form';
import { LanguageSwitcher } from '@/components/auth/language-switcher';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default async function RegisterPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await redirectIfUser();

  const t = await getTranslations('register');

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-background via-background to-muted/20 lg:grid lg:grid-cols-2 relative overflow-hidden">
      {/* Main Content - Mobile First */}
      <div className="flex min-h-screen flex-col items-center justify-start lg:justify-center p-4 sm:p-6 lg:p-8 relative overflow-y-auto">
        {/* Language Switcher - Top Right */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50">
          <LanguageSwitcher />
        </div>

        {/* Registration Card */}
        <div className="w-full max-w-md space-y-6 my-auto lg:my-0 py-8 lg:py-0">
          <Card className="border-0 shadow-lg sm:shadow-xl">
            <CardHeader className="space-y-3 text-center pb-4">
              <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  {t('title')}
                </h1>
                <p className="text-sm text-muted-foreground sm:text-base">
                  {t('subtitle')}
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pb-4 sm:pb-6">
              <RegisterForm />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right Side - Desktop Only */}
      <div className="hidden bg-muted lg:flex lg:items-center lg:justify-center lg:relative overflow-hidden z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 z-0" />
        <Image
          src="/login-hero.svg"
          alt="Shop Management"
          width="1920"
          height="1080"
          className="h-full w-full object-cover relative z-0"
          priority
        />
      </div>
    </div>
  );
}
