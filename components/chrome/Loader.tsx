'use client';

import { useGSAP } from '@gsap/react';
import { useEffect, useRef, useState } from 'react';
import { gsap } from '@/components/chrome/gsapSetup';
import styles from './Loader.module.css';

// Shorter than it once was: with no counter or label to read, a longer hold is
// just a blank screen.
const MIN_VISIBLE_MS = 500;
const HARD_STOP_MS = 2600;

export function Loader() {
  const [done, setDone] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const seamRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let finished = false;
    let minTimer = 0;

    const finish = () => {
      if (finished) return;
      finished = true;
      setDone(true);
      // Cues the hero entrance without duplicating this component's timing.
      document.body.classList.add('loaded');
      window.dispatchEvent(new Event('app:loaded'));
    };

    // Hold briefly so the reveal reads as deliberate, then wait for the page
    // itself if it is somehow still loading.
    const afterMinimum = () => {
      if (document.readyState === 'complete') {
        finish();
        return;
      }
      window.addEventListener('load', finish, { once: true });
    };

    minTimer = window.setTimeout(afterMinimum, MIN_VISIBLE_MS);
    const hardStop = window.setTimeout(finish, HARD_STOP_MS);

    return () => {
      window.clearTimeout(minTimer);
      window.clearTimeout(hardStop);
      window.removeEventListener('load', finish);
    };
  }, []);

  useGSAP(
    () => {
      if (!done) return;
      // Reduced motion gets the plain opacity fallback in CSS instead.
      if (window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;

      // ±104% rather than 100% so the seam's tooth amplitude clears the
      // viewport without leaving a sliver. power3.out keeps the halves moving
      // from the first frame — an inOut ease hides most of the travel in a
      // brief burst, which reads as a cut rather than a peel.
      gsap
        .timeline({ delay: 0.15 })
        .to(seamRef.current, { scaleX: 1, duration: 0.4, ease: 'power2.inOut' })
        .to(seamRef.current, { autoAlpha: 0, duration: 0.25 })
        .to(topRef.current, { yPercent: -104, duration: 1.1, ease: 'power3.out' }, '<')
        .to(bottomRef.current, { yPercent: 104, duration: 1.1, ease: 'power3.out' }, '<');
    },
    { scope: rootRef, dependencies: [done] },
  );

  return (
    <div
      ref={rootRef}
      className={done ? `${styles.loader} ${styles.done}` : styles.loader}
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div ref={topRef} className={`${styles.panel} ${styles.panelTop}`} />
      <div ref={bottomRef} className={`${styles.panel} ${styles.panelBottom}`} />
      <span ref={seamRef} className={styles.seam} aria-hidden="true" />
    </div>
  );
}
