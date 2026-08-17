'use client';

import { useGSAP } from '@gsap/react';
import { useRef } from 'react';
import { gsap } from '@/components/chrome/gsapSetup';

// Staggers a grid's direct children in as one choreographed set. Children need
// an `opacity: 0` rest state in CSS so nothing flashes before hydration.
export function useGridStagger<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;

      gsap.fromTo(
        el.children,
        { opacity: 0, y: 16, scale: 0.92 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.4,
          ease: 'back.out(1.4)',
          stagger: { each: 0.06, from: 'start', grid: 'auto' },
          scrollTrigger: { trigger: el, start: 'top 80%', once: true },
        },
      );
    },
    { scope: ref },
  );

  return ref;
}
