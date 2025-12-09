'use client';

import { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Lenis from 'lenis';

function ScrollToTop() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Use a small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      if (window.lenis) {
        window.lenis.scrollTo(0, { immediate: false });
      } else {
        // Fallback if Lenis is not ready
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  return null;
}

export default function SmoothScrollProvider({ children }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Expose lenis instance for manual control
    window.lenis = lenis;

    return () => {
      lenis.destroy();
      window.lenis = null;
    };
  }, []);

  return (
    <>
      <Suspense fallback={null}>
        <ScrollToTop />
      </Suspense>
      {children}
    </>
  );
}





