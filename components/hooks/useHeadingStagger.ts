'use client';

import { useGSAP } from '@gsap/react';
import { useRef } from 'react';
import { gsap } from '@/components/chrome/gsapSetup';

const WORD_STAGGER = 0.08;

// Scope this on the element wrapping the heading. Any [data-word] inside it
// staggers in; an optional [data-heading-extra] fades in after the last word.
export function useHeadingStagger<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;

      const words = el.querySelectorAll('[data-word]');
      if (!words.length) return;

      const scrollTrigger = { trigger: el, start: 'top 85%', once: true } as const;

      gsap.fromTo(
        words,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: WORD_STAGGER,
          ease: 'power2.out',
          scrollTrigger,
        },
      );

      const extra = el.querySelector('[data-heading-extra]');
      if (extra) {
        gsap.fromTo(
          extra,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            delay: words.length * WORD_STAGGER,
            ease: 'power2.out',
            scrollTrigger,
          },
        );
      }
    },
    { scope: ref },
  );

  return ref;
}
