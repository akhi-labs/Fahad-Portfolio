'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/components/chrome/gsapSetup';
import { createLiquidRenderer } from '@/lib/webgl/createLiquidRenderer';
import styles from './HeroLiquid.module.css';

/**
 * Cursor-following liquid over the hero name. Mounts a single WebGL canvas that
 * paints a white metaball chain; `mix-blend-mode: difference` in CSS turns that
 * into an inverted puddle. Renders nothing at all on touch devices, under
 * reduced motion, or where WebGL is unavailable.
 */
export function HeroLiquid() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    if (!window.matchMedia('(pointer:fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;

    const renderer = createLiquidRenderer();
    if (!renderer) return; // No WebGL — hero just stays as it is.

    host.appendChild(renderer.canvas);

    // The blob is confined to this box, so all pointer maths is relative to it.
    const area = host.parentElement ?? host;
    let rect = area.getBoundingClientRect();

    const measure = () => {
      rect = area.getBoundingClientRect();
      renderer.resize(rect.width, rect.height);
    };
    measure();

    const fade = { value: 0 };
    let inside = false;
    let hinting = false;
    let hintTl: gsap.core.Timeline | null = null;

    /**
     * One slow drift across the name shortly after the loader opens, so the
     * effect announces itself instead of waiting to be discovered. Any real
     * pointer movement into the area cancels it and hands over to the cursor.
     */
    const playHint = () => {
      if (inside) return;
      hinting = true;
      const drift = { u: 0.28, v: 0.46 };
      renderer.snapTo(drift.u, drift.v);
      renderer.start();

      hintTl = gsap
        .timeline({
          onUpdate: () => {
            if (!hinting) return;
            renderer.setPointer(drift.u, drift.v);
            renderer.setAlpha(fade.value);
          },
          onComplete: () => {
            if (!hinting) return;
            hinting = false;
            renderer.stop();
          },
        })
        .to(fade, { value: 1, duration: 0.7, ease: 'power2.out' })
        .to(drift, { u: 0.72, v: 0.54, duration: 1.9, ease: 'sine.inOut' }, 0)
        .to(fade, { value: 0, duration: 0.7, ease: 'power2.in' }, '-=0.7');
    };

    // Kills the whole timeline, not just the fade — the drift tween lives on a
    // separate object and would otherwise keep driving the pointer.
    const stopHint = () => {
      if (!hinting) return;
      hinting = false;
      hintTl?.kill();
      hintTl = null;
    };

    const toUv = (clientX: number, clientY: number): [number, number] => [
      (clientX - rect.left) / rect.width,
      (clientY - rect.top) / rect.height,
    ];

    const onMove = (e: PointerEvent) => {
      const [u, v] = toUv(e.clientX, e.clientY);
      const within = u >= 0 && u <= 1 && v >= 0 && v <= 1;

      if (within && !inside) {
        inside = true;
        stopHint();
        // Land the whole chain here rather than sweeping it across the hero.
        renderer.snapTo(u, v);
        renderer.start();
        gsap.to(fade, {
          value: 1,
          duration: 0.45,
          ease: 'power2.out',
          overwrite: true,
          onUpdate: () => renderer.setAlpha(fade.value),
        });
      } else if (!within && inside) {
        inside = false;
        gsap.to(fade, {
          value: 0,
          duration: 0.5,
          ease: 'power2.in',
          overwrite: true,
          onUpdate: () => renderer.setAlpha(fade.value),
          // Idle the GPU once it is fully invisible.
          onComplete: () => renderer.stop(),
        });
      }

      if (within) renderer.setPointer(u, v);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('resize', measure);
    // Sections above the hero can resize; keep the box in step while scrolling.
    window.addEventListener('scroll', measure, { passive: true });

    // Wait for the loader to finish so the hint isn't hidden behind it.
    let hintTimer = 0;
    const queueHint = () => {
      hintTimer = window.setTimeout(() => {
        measure();
        playHint();
      }, 900);
    };
    if (document.body.classList.contains('loaded')) queueHint();
    else window.addEventListener('app:loaded', queueHint, { once: true });

    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', measure);
      window.removeEventListener('app:loaded', queueHint);
      window.clearTimeout(hintTimer);
      hinting = false;
      hintTl?.kill();
      gsap.killTweensOf(fade);
      renderer.destroy();
      renderer.canvas.remove();
    };
  }, []);

  return <div ref={hostRef} className={styles.liquid} aria-hidden="true" />;
}
