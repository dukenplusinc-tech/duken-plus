import { FC, Fragment } from 'react';
import { SlashIcon } from '@radix-ui/react-icons';

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
  return (
    <Breadcrumb className="hidden md:flex">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href={fromUrl.toHome()}>Home</BreadcrumbLink>
        </BreadcrumbItem>

        {links?.map((link, idx) => (
          <Fragment key={`${idx.toString()}_${link.href}`}>
            <BreadcrumbSeparator>
              <SlashIcon />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              {link.href ? (
                <BreadcrumbLink href={link.href || ''}>
                  <span className="capitalize">{link.label}</span>
                </BreadcrumbLink>
              ) : (
                <span className="capitalize">{link.label}</span>
              )}
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
