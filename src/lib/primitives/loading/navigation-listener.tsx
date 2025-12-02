'use client';

import { useCallback, useEffect, useRef } from 'react';
import {
  useRouter as useNextRouter,
  usePathname,
  useSearchParams,
} from 'next/navigation';

import { useLoading } from './context';

export function NavigationListener() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useNextRouter();
  const { startLoading, stopLoading } = useLoading();
  const isFirstMount = useRef(true);
  const prevPathname = useRef(pathname);
  const prevSearchParams = useRef(searchParams?.toString());
  const pendingNavigationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentPathnameRef = useRef(pathname);

  // Update current pathname ref
  useEffect(() => {
    currentPathnameRef.current = pathname;
  }, [pathname]);

  // Cleanup function to stop loading
  const cleanupLoading = useCallback(() => {
    if (pendingNavigationTimeoutRef.current) {
      clearTimeout(pendingNavigationTimeoutRef.current);
      pendingNavigationTimeoutRef.current = null;
    }
    stopLoading();
  }, [stopLoading]);

  // Intercept router.push, router.replace, and router.back calls
  useEffect(() => {
    const originalPush = router.push;
    const originalReplace = router.replace;
    const originalBack = router.back;

    // Helper to check if navigation will actually change the route
    const willNavigate = (href: string): boolean => {
      // Normalize hrefs for comparison
      const normalizePath = (p: string) => p.split('?')[0].split('#')[0];
      const currentPath = normalizePath(currentPathnameRef.current);
      const targetPath = normalizePath(href);
      return currentPath !== targetPath;
    };

    // Override push with error handling
    (router as any).push = ((href: string, options?: any) => {
      // Only start loading if navigation will actually change the route
      if (willNavigate(href)) {
        startLoading();

        // Set a timeout to stop loading if navigation doesn't complete
        // This handles errors and same-page navigation attempts
        if (pendingNavigationTimeoutRef.current) {
          clearTimeout(pendingNavigationTimeoutRef.current);
        }
        pendingNavigationTimeoutRef.current = setTimeout(() => {
          cleanupLoading();
        }, 2000); // Max 2 seconds for navigation
      }

      try {
        const result = originalPush.call(router, href, options);
        return result;
      } catch (error) {
        // Clean up loading on error
        cleanupLoading();
        throw error;
      }
    }) as typeof router.push;

    // Override replace if it exists
    if (originalReplace) {
      (router as any).replace = ((href: string, options?: any) => {
        if (willNavigate(href)) {
          startLoading();
          if (pendingNavigationTimeoutRef.current) {
            clearTimeout(pendingNavigationTimeoutRef.current);
          }
          pendingNavigationTimeoutRef.current = setTimeout(() => {
            cleanupLoading();
          }, 2000);
        }

        try {
          const result = originalReplace.call(router, href, options);
          return result;
        } catch (error) {
          cleanupLoading();
          throw error;
        }
      }) as typeof router.replace;
    }

    // Override back if it exists
    if (originalBack) {
      (router as any).back = (() => {
        startLoading();
        if (pendingNavigationTimeoutRef.current) {
          clearTimeout(pendingNavigationTimeoutRef.current);
        }
        pendingNavigationTimeoutRef.current = setTimeout(() => {
          cleanupLoading();
        }, 2000);

        try {
          const result = originalBack.call(router);
          return result;
        } catch (error) {
          cleanupLoading();
          throw error;
        }
      }) as typeof router.back;
    }

    return () => {
      (router as any).push = originalPush;
      if (originalReplace) (router as any).replace = originalReplace;
      if (originalBack) (router as any).back = originalBack;
      cleanupLoading();
    };
  }, [router, startLoading, cleanupLoading]);

  // Intercept all link clicks globally to show loading immediately
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      const is3DotsButton =
        target.classList.contains('button-small') &&
        target.classList.contains('button-has-icon-only') &&
        target.classList.contains('button-clear');

      if (is3DotsButton) {
        return;
      }

      // Check if clicked element or its parent is a link
      const link = target.closest('a[href]') as HTMLAnchorElement;

      if (link) {
        const href = link.getAttribute('href');

        // Only intercept internal navigation links
        // Check for relative paths, not external URLs or special protocols
        const isInternalLink =
          href &&
          !link.target &&
          !link.download &&
          !link.hasAttribute('data-external') &&
          (href.startsWith('/') ||
            href.startsWith('./') ||
            href.startsWith('../') ||
            (!href.startsWith('http') &&
              !href.startsWith('mailto:') &&
              !href.startsWith('tel:') &&
              !href.startsWith('#') &&
              !href.startsWith('javascript:')));

        if (isInternalLink) {
          // Normalize paths for comparison
          const normalizePath = (p: string) => {
            const url = new URL(p, window.location.origin);
            return url.pathname;
          };

          const currentPath = normalizePath(currentPathnameRef.current);
          const targetPath = normalizePath(href);

          // Only start loading if navigation will actually change the route
          if (currentPath !== targetPath) {
            startLoading();

            // Set a timeout to stop loading if navigation doesn't complete
            // This handles errors and prevents stuck loaders
            if (pendingNavigationTimeoutRef.current) {
              clearTimeout(pendingNavigationTimeoutRef.current);
            }
            pendingNavigationTimeoutRef.current = setTimeout(() => {
              cleanupLoading();
            }, 2000); // Max 2 seconds for navigation
          }
        }
      }
    };

    // Use capture phase to catch clicks early
    document.addEventListener('click', handleClick, true);

    return () => {
      document.removeEventListener('click', handleClick, true);
    };
  }, [startLoading, cleanupLoading]);

  // Start/stop loading when navigation occurs
  useEffect(() => {
    // Skip on initial mount
    if (isFirstMount.current) {
      isFirstMount.current = false;
      prevPathname.current = pathname;
      prevSearchParams.current = searchParams?.toString();
      return;
    }

    // Check if pathname or search params changed
    const pathnameChanged = prevPathname.current !== pathname;
    const searchParamsChanged =
      prevSearchParams.current !== searchParams?.toString();

    if (pathnameChanged || searchParamsChanged) {
      // Clear any pending timeout since navigation completed
      if (pendingNavigationTimeoutRef.current) {
        clearTimeout(pendingNavigationTimeoutRef.current);
        pendingNavigationTimeoutRef.current = null;
      }

      // Start loading immediately when route changes (fallback if click wasn't caught)
      // This ensures loading shows even if click interception failed
      startLoading();

      // Stop loading after navigation completes
      const timer = setTimeout(() => {
        stopLoading();
      }, 200);

      prevPathname.current = pathname;
      prevSearchParams.current = searchParams?.toString();

      return () => {
        clearTimeout(timer);
      };
    }
  }, [pathname, searchParams, startLoading, stopLoading]);

  // Handle navigation errors globally
  useEffect(() => {
    const handleError = () => {
      cleanupLoading();
    };

    // Listen for unhandled errors that might occur during navigation
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleError);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleError);
      cleanupLoading();
    };
  }, [cleanupLoading]);

  return null;
}
