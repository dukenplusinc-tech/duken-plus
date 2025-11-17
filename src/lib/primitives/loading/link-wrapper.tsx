'use client';

import { type ComponentProps, forwardRef } from 'react';
import Link from 'next/link';
import { useLoading } from './context';

/**
 * Enhanced Link component that shows loading overlay on click
 */
export const LoadingLink = forwardRef<
  HTMLAnchorElement,
  ComponentProps<typeof Link>
>(({ href, onClick, ...props }, ref) => {
  const { startLoading, stopLoading } = useLoading();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Only show loading if it's a client-side navigation
    // (not external links, not links with target="_blank", etc.)
    if (
      !props.target &&
      !props.download &&
      href &&
      typeof href === 'string' &&
      (href.startsWith('/') || href.startsWith('./') || href.startsWith('../'))
    ) {
      startLoading();
      
      // Stop loading after navigation completes
      // This is a fallback in case the navigation listener doesn't catch it
      setTimeout(() => {
        stopLoading();
      }, 500);
    }

    // Call original onClick if provided
    onClick?.(e);
  };

  return <Link ref={ref} href={href} onClick={handleClick} {...props} />;
});

LoadingLink.displayName = 'LoadingLink';

