import type { Metadata } from 'next';

import CashDesk from './cash-desk';

export const metadata: Metadata = {
  title: 'Cash Desk',
  description: 'Manage your cash desk',
};

export default async function CashDeskPage() {
  return <CashDesk />;
}
