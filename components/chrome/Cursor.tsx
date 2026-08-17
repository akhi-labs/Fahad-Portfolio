'use client';

import { useEffect, useRef } from 'react';
import { gsap } from './gsapSetup';
import styles from './Cursor.module.css';

// Hit-tests on pointermove instead of binding per element, so it keeps working
// across route changes without rebinding. Pointer-type gated only — the
// reference deliberately keeps the cursor active under reduced motion.
export function Cursor() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const cursor = ref.current;
    if (!cursor) return;
    if (!window.matchMedia('(pointer:fine)').matches) return;

    const xTo = gsap.quickTo(cursor, 'left', { duration: 0.18, ease: 'power3' });
    const yTo = gsap.quickTo(cursor, 'top', { duration: 0.18, ease: 'power3' });

    const onMove = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);

      const target = e.target instanceof Element ? e.target : null;
      const hit = target?.closest('a,button,[data-cursor]');

      if (hit) {
        cursor.classList.add(styles.big);
        cursor.dataset.label =
          hit.closest('[data-cursor="view"]') !== null ? 'VIEW' : 'OPEN';
      } else {
        cursor.classList.remove(styles.big);
        cursor.dataset.label = '';
      }
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  return <div ref={ref} className={styles.cursor} data-label="" aria-hidden="true" />;
}
