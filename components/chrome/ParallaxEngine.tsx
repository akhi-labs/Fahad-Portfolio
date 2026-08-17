'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

// Re-queries [data-parallax] every frame (like the reference implementation), so
// it needs no per-element registration and adapts to whatever route is mounted.
export function ParallaxEngine() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;

    let ticking = false;

    const update = () => {
      document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
        const container = el.parentElement;
        if (!container) return;
        const r = container.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) return;
        const speed = parseFloat(el.dataset.parallax ?? '') || 0.04;
        const center = r.top + r.height / 2 - window.innerHeight / 2;
        el.style.transform = `scale(1.1) translate3d(0,${(-center * speed).toFixed(1)}px,0)`;
      });
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [pathname]);

  return null;
}
