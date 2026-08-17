'use client';

import { useGSAP } from '@gsap/react';
import { useRef } from 'react';
import { gsap, SplitText } from '@/components/chrome/gsapSetup';
import { site } from '@/lib/site';
import { HeroLiquid } from './HeroLiquid';
import styles from './Hero.module.css';

// How far from a letter the cursor still moves it, in px.
const WAVE_RADIUS = 340;
const WAVE_LIFT = 30;
const WAVE_TILT = 7;

export function Hero() {
  const nameRef = useRef<HTMLHeadingElement | null>(null);

  useGSAP(
    () => {
      const el = nameRef.current;
      if (!el) return;
      if (window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;

      let split: SplitText | null = null;
      let chars: HTMLElement[] = [];
      let yTo: ReturnType<typeof gsap.quickTo>[] = [];
      let scaleXTo: ReturnType<typeof gsap.quickTo>[] = [];
      let scaleYTo: ReturnType<typeof gsap.quickTo>[] = [];
      let rotTo: ReturnType<typeof gsap.quickTo>[] = [];
      let ticking = false;
      const fine = window.matchMedia('(pointer:fine)').matches;

      // Tracked on the window rather than the heading, so the letters react to
      // the cursor approaching instead of requiring a direct hover. Distance
      // falloff settles them back to rest on its own once it moves away.
      const apply = (cx: number, cy: number) => {
        chars.forEach((char, i) => {
          const r = char.getBoundingClientRect();
          const dx = cx - (r.left + r.width / 2);
          const dy = cy - (r.top + r.height / 2);
          const falloff = Math.max(0, 1 - Math.hypot(dx, dy) / WAVE_RADIUS);
          const eased = falloff * falloff;
          const scale = 1 + 0.12 * eased;
          yTo[i](-WAVE_LIFT * eased);
          scaleXTo[i](scale);
          scaleYTo[i](scale);
          rotTo[i](-(dx / WAVE_RADIUS) * WAVE_TILT * eased);
        });
        ticking = false;
      };

      const onMove = (e: PointerEvent) => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => apply(e.clientX, e.clientY));
      };

      const play = () => {
        // aria:'none' keeps the h1's own aria-label; the split words are already
        // aria-hidden, and the element's textContent has no space between lines.
        split = new SplitText(el, { type: 'chars', aria: 'none' });
        chars = split.chars as HTMLElement[];

        gsap.set(chars, { opacity: 0, y: 20, rotationX: -40 });
        gsap.set(el, { opacity: 1 });
        gsap.to(chars, {
          opacity: 1,
          y: 0,
          rotationX: 0,
          duration: 0.6,
          stagger: 0.015,
          ease: 'expo.out',
          onComplete: () => {
            if (!fine) return;
            // Built after the entrance so the two never fight over y.
            //
            // GSAP's own transform names, not the CSS ones: `scale` and
            // `rotate` are real CSS properties now, and SplitText writes
            // `scale:none; rotate:none` inline on every character — so quickTo
            // would target those multi-value shorthands, which it cannot reset.
            const opts = { duration: 0.5, ease: 'elastic.out(1,0.5)' };
            yTo = chars.map((c) => gsap.quickTo(c, 'y', opts));
            scaleXTo = chars.map((c) => gsap.quickTo(c, 'scaleX', opts));
            scaleYTo = chars.map((c) => gsap.quickTo(c, 'scaleY', opts));
            rotTo = chars.map((c) => gsap.quickTo(c, 'rotation', opts));
            window.addEventListener('pointermove', onMove, { passive: true });
          },
        });
      };

      if (document.body.classList.contains('loaded')) {
        play();
      } else {
        window.addEventListener('app:loaded', play, { once: true });
      }

      return () => {
        window.removeEventListener('app:loaded', play);
        window.removeEventListener('pointermove', onMove);
        split?.revert();
      };
    },
    { scope: nameRef },
  );

  return (
    <section className={styles.hero} id="top">
      <div className={styles.copy}>
        <h1
          ref={nameRef}
          className={styles.name}
          aria-label={`${site.name}'s Portfolio`}
        >
          <span className={styles.nameLine} aria-hidden="true">
            {site.firstName}
          </span>
          <span className={styles.nameLine} aria-hidden="true">
            {site.lastName}&apos;S
          </span>
          <span className={styles.nameLine} aria-hidden="true">
            PORTFOLIO
          </span>
        </h1>
        <HeroLiquid />
      </div>
      <span className={styles.tag}>Portfolio / 2016—{site.year}</span>
    </section>
  );
}
