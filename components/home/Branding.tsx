'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ScrollTrigger, gsap } from '@/components/chrome/gsapSetup';
import { SectionTitleRow } from '@/components/shared/SectionTitleRow';
import { BRANDS } from '@/lib/branding';
import { BrandingLightbox } from './BrandingLightbox';
import { BrandingRow } from './BrandingRow';
import styles from './Branding.module.css';

/* Marquee tuning. Speeds are px/second so they stay honest across refresh rates. */
const BASE = [34, 28, 40]; // rest drift per row, slightly desynced
const DIR = [-1, 1, -1]; // rest travel direction, alternating
const VEL_SCALE = 0.28; // scroll px/s -> marquee px/s
const MAX_BOOST = 900; // caps a trackpad fling
const MAX_SPEED = 1000; // absolute guard
const TAU = 0.12; // s, smoothing time constant

type Track = { el: HTMLDivElement; setX: (x: number) => void; setWidth: number; x: number };
type Opened = { row: number; index: number };

export function Branding() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const tracks = useRef<(Track | null)[]>([]);
  const velocity = useRef(0);
  const smoothed = useRef(0);
  const pausedRef = useRef(false);
  // Per-row, so hovering one row to click a frame doesn't freeze the whole band.
  const hovered = useRef<boolean[]>([]);

  const [warm, setWarm] = useState(false);
  const [open, setOpen] = useState<Opened | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  // Takes the index as an argument rather than being curried per row: a curried
  // `registerTrack(i)` would be a fresh closure on every render, which churns
  // the row's effects and lets their cleanup null the track after it registers.
  const registerTrack = useCallback(
    (index: number, el: HTMLDivElement | null, setWidth: number) => {
      if (!el || setWidth <= 0) {
        tracks.current[index] = null;
        return;
      }
      const existing = tracks.current[index];
      tracks.current[index] = {
        el,
        setX: gsap.quickSetter(el, 'x', 'px') as (x: number) => void,
        setWidth,
        // Start half a set in so both travel directions have content either side.
        x: existing && existing.el === el ? existing.x : -setWidth / 2,
      };
    },
    [],
  );

  // Deliberately a plain effect, not useGSAP: this is a persistent ticker and a
  // ScrollTrigger, not a tween context. useGSAP reverts on every dependency
  // change, which would tear the loop down mid-flight.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (window.matchMedia('(prefers-reduced-motion:reduce)').matches) {
      // Still load the tiles — the CSS turns the band into a native scroller.
      // Deferred a frame so this isn't a synchronous setState in an effect.
      const id = requestAnimationFrame(() => setWarm(true));
      return () => cancelAnimationFrame(id);
    }

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        velocity.current = self.getVelocity();
      },
      onEnter: () => setWarm(true),
      onEnterBack: () => setWarm(true),
    });

    const update = (_time: number, deltaMs: number) => {
      if (!trigger.isActive || pausedRef.current) return;

      const dt = Math.min(deltaMs, 50) / 1000;

      // onUpdate only fires while scrolling, so the last velocity would stick
      // forever once the user stops.
      if (!ScrollTrigger.isScrolling()) velocity.current = 0;

      const target = gsap.utils.clamp(-MAX_BOOST, MAX_BOOST, velocity.current * VEL_SCALE);
      smoothed.current += (target - smoothed.current) * (1 - Math.exp(-dt / TAU));

      for (let i = 0; i < tracks.current.length; i++) {
        const track = tracks.current[i];
        if (!track || track.setWidth <= 0) continue;
        // Hovering holds a row still so a frame can actually be clicked.
        if (hovered.current[i]) continue;

        // Scrolling up drives `smoothed` negative until this crosses zero, so
        // the reversal happens continuously with no snap.
        const speed = gsap.utils.clamp(
          -MAX_SPEED,
          MAX_SPEED,
          (DIR[i] ?? -1) * ((BASE[i] ?? 32) + smoothed.current),
        );

        track.x = gsap.utils.wrap(-track.setWidth, 0, track.x + speed * dt);
        track.setX(track.x);
      }
    };

    gsap.ticker.add(update);
    return () => {
      gsap.ticker.remove(update);
      trigger.kill();
    };
  }, []);

  // Freeze the band and lock the page while the lightbox is up. A dedicated
  // class, not `menu-open` — PageChrome owns that one and clears it on nav
  // close, which would unlock the body out from under us.
  useEffect(() => {
    pausedRef.current = open !== null;
    document.body.classList.toggle('lightbox-open', open !== null);
    return () => {
      document.body.classList.remove('lightbox-open');
    };
  }, [open]);

  const handleOpen = useCallback((row: number, index: number, trigger: HTMLElement) => {
    triggerRef.current = trigger;
    setOpen({ row, index });
  }, []);

  const handleHover = useCallback((index: number, isHovering: boolean) => {
    hovered.current[index] = isHovering;
  }, []);

  const handleClose = useCallback(() => {
    setOpen(null);
    triggerRef.current?.focus();
  }, []);

  const handleNavigate = useCallback((delta: number) => {
    setOpen((current) => {
      if (!current) return current;
      const total = BRANDS[current.row]?.images.length ?? 0;
      if (total === 0) return current;
      return { ...current, index: gsap.utils.wrap(0, total, current.index + delta) };
    });
  }, []);

  return (
    <section ref={sectionRef} className={styles.branding} id="branding">
      <div className={`${styles.head} shell`}>
        <SectionTitleRow
          lines={['BRAND', 'WORK']}
          right={
            <p className="section-lead">
              A selection of branding work focused on creating clear, distinctive and
              consistent visual identities.
            </p>
          }
        />
      </div>

      <div className={styles.rows}>
        {BRANDS.map((row, i) => (
          <BrandingRow
            key={row.slug}
            row={row}
            index={i}
            onTrack={registerTrack}
            warm={warm}
            onOpen={handleOpen}
            onHover={handleHover}
          />
        ))}
      </div>

      {open && BRANDS[open.row] && (
        <BrandingLightbox
          row={BRANDS[open.row]}
          index={open.index}
          onClose={handleClose}
          onNavigate={handleNavigate}
        />
      )}
    </section>
  );
}
