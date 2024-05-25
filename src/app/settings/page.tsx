import type { Metadata } from 'next';
import Link from 'next/link';

import { ChangePasswordCard } from '@/lib/entities/settings/containers/change-password';

export const metadata: Metadata = {
  title: 'Issues',
  description: 'All issues',
};

export default async function IssuesPage() {
  return (
    <div className="mt-10">
      <div className="mx-auto grid w-full max-w-6xl gap-2 mb-10">
        <h1 className="text-3xl font-semibold">Settings</h1>
      </div>
      <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
        <nav className="grid gap-4 text-sm text-muted-foreground">
          <Link href="#" className="font-semibold text-primary">
            General
          </Link>
          <Link href="#">Security</Link>
        </nav>
        <div className="grid gap-6">
          <ChangePasswordCard />
        </div>
      </div>
    </div>
  );
}
