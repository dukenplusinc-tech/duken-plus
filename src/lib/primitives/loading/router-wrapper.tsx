'use client';

import { useEffect } from 'react';
import { useRouter as useNextRouter } from 'next/navigation';
import { useLoading } from './context';

/**
 * Wrapper hook that intercepts router.push calls to show loading
 */
export function useRouterWithLoading() {
  const router = useNextRouter();
  const { startLoading, stopLoading } = useLoading();

  // Intercept navigation by wrapping router methods
  useEffect(() => {
    // Store original push method
    const originalPush = router.push.bind(router);
    const originalReplace = router.replace?.bind(router);
    const originalBack = router.back?.bind(router);

    // Override push to show loading
    (router as any).push = (href: string, options?: any) => {
      startLoading();
      const result = originalPush(href, options);
      
      // Stop loading after navigation completes
      // Next.js navigation is async, so we use a timeout
      setTimeout(() => {
        stopLoading();
      }, 300);
      
      return result;
    };

    if (originalReplace) {
      (router as any).replace = (href: string, options?: any) => {
        startLoading();
        const result = originalReplace(href, options);
        setTimeout(() => {
          stopLoading();
        }, 300);
        return result;
      };
    }

    if (originalBack) {
      (router as any).back = () => {
        startLoading();
        const result = originalBack();
        setTimeout(() => {
          stopLoading();
        }, 300);
        return result;
      };
    }

    // Cleanup
    return () => {
      (router as any).push = originalPush;
      if (originalReplace) (router as any).replace = originalReplace;
      if (originalBack) (router as any).back = originalBack;
    };
  }, [router, startLoading, stopLoading]);

  return router;
}

