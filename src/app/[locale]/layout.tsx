import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

import { brand } from '@/config/brand';
import { Toaster } from '@/components/ui/toaster';

import '../globals.css';

import { IonicProvider } from '@/components/ionic/provider';

export const metadata: Metadata = {
  title: brand.name,
  description: brand.description,
};

export default async function RootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
          <IonicProvider>{children}</IonicProvider>
          <Toaster />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
