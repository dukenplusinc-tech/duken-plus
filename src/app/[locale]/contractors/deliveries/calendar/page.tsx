import type { Metadata } from 'next';

import { CalendarDelivers } from '@/lib/entities/deliveries/containers/calendar';

export const metadata: Metadata = {
  title: 'Calendar',
  description: '',
};

export default async function CalendarPage() {
  return <CalendarDelivers />;
}
