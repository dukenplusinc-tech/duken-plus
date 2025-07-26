'use client';

import Link from 'next/link';
import { Clock } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { useConsignmentCount } from '@/lib/entities/deliveries/hooks/useConsignmentCount';
import { fromUrl } from '@/lib/url';

export default function Consignment() {
  const { data: count } = useConsignmentCount();
  const t = useTranslations('home.consignment');

  return (
    <Link href={fromUrl.toConsignement()}>
      <div className="mx-2 mt-4 mb-4 bg-success text-success-foreground p-4 rounded-md flex items-center justify-between">
        <div className="flex items-center">
          <Clock size={32} className="mr-3" />
          <span className="text-2xl">{t('title')}</span>
        </div>
        <div className="bg-white text-black font-bold text-2xl px-3 py-1 rounded">
          {count}
        </div>
      </div>
    </Link>
  );
}
