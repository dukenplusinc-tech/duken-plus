import { FC, Fragment } from 'react';
import { SlashIcon } from '@radix-ui/react-icons';
import { useTranslations } from 'next-intl';

import * as fromUrl from '@/lib/url/generator';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export interface PageBreadcrumbLink {
  label: string;
  href: string;
}

export interface PageBreadcrumbsProps {
  links?: PageBreadcrumbLink[];
}

export const PageBreadcrumbs: FC<PageBreadcrumbsProps> = ({ links }) => {
  const t = useTranslations('breadcrumbs');

  return (
    <Breadcrumb className="hidden md:flex">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href={fromUrl.toHome()}>
            <span className="capitalize">{t('home')}</span>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {links?.map((link, idx) => (
          <Fragment key={`${idx.toString()}_${link.href}`}>
            <BreadcrumbSeparator>
              <SlashIcon />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              {link.href ? (
                <BreadcrumbLink href={link.href || ''}>
                  <span className="capitalize">
                    {t(link.label.toLowerCase())}
                  </span>
                </BreadcrumbLink>
              ) : (
                <span className="capitalize">
                  {t(link.label.toLowerCase())}
                </span>
              )}
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
