'use client';

import { useGSAP } from '@gsap/react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { gsap } from '@/components/chrome/gsapSetup';
import { PlaceholderImage } from '@/components/shared/PlaceholderImage';
import { PROJECTS } from '@/lib/projects';
import { site } from '@/lib/site';
import styles from './NavPreview.module.css';

type PreviewKind = 'home' | 'work' | 'about';

const OFFSET_X = 28;
const OFFSET_Y = -40;

function isPreviewKind(value: string | undefined): value is PreviewKind {
  return value === 'home' || value === 'work' || value === 'about';
}

export function NavPreview({ open }: { open: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<PreviewKind | null>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !open) return;
      if (!window.matchMedia('(pointer:fine)').matches) return;

      const reduced = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
      const list = document.querySelector('[data-nav-list]');

      // Kept inside the viewport so the panel never renders half off-screen.
      const place = (clientX: number, clientY: number) => {
        const x = Math.min(clientX + OFFSET_X, window.innerWidth - el.offsetWidth - 8);
        const y = Math.min(
          Math.max(clientY + OFFSET_Y, 8),
          window.innerHeight - el.offsetHeight - 8,
        );
        return { x, y };
      };

      const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3' });
      const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3' });

      const onMove = (e: PointerEvent) => {
        const { x, y } = place(e.clientX, e.clientY);
        if (reduced) {
          gsap.set(el, { x, y });
          return;
        }
        xTo(x);
        yTo(y);
      };

      // Delegated so moving between adjacent links never flickers the panel.
      const onOver = (e: Event) => {
        const hit = (e.target as Element | null)?.closest<HTMLElement>('[data-preview]');
        const kind = hit?.dataset.preview;
        setActive(isPreviewKind(kind) ? kind : null);
      };
      const onLeave = () => setActive(null);

      window.addEventListener('pointermove', onMove, { passive: true });
      list?.addEventListener('pointerover', onOver);
      list?.addEventListener('pointerleave', onLeave);

      return () => {
        window.removeEventListener('pointermove', onMove);
        list?.removeEventListener('pointerover', onOver);
        list?.removeEventListener('pointerleave', onLeave);
        setActive(null);
      };
    },
    { scope: ref, dependencies: [open] },
  );

  // Deliberately a plain effect, not useGSAP: useGSAP reverts its context on
  // every dependency change, and with two hooks sharing this element's scope
  // those reverts undo the visibility tween — which left the panel stuck
  // visible at the top-left corner as soon as the overlay opened.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
    const visible = Boolean(active) && open;

    const tween = gsap.to(el, {
      autoAlpha: visible ? 1 : 0,
      scale: reduced ? 1 : visible ? 1 : 0.92,
      duration: reduced ? 0 : visible ? 0.35 : 0.25,
      ease: visible ? 'power3.out' : 'power2.in',
      overwrite: 'auto',
    });
    return () => {
      tween.kill();
    };
  }, [active, open]);

  const cover = PROJECTS[0];

  return (
    <div ref={ref} className={styles.preview} aria-hidden="true">
      {/* The hero has no image of its own, so HOME borrows the portrait. */}
      {active === 'home' &&
        (site.portraitImage ? (
          <Image
            className={styles.media}
            src={site.portraitImage}
            alt=""
            fill
            sizes="240px"
          />
        ) : (
          <PlaceholderImage label="Portrait — public/images/portrait.jpg" />
        ))}
      {active === 'work' &&
        (cover.image ? (
          <Image className={styles.media} src={cover.image} alt="" fill sizes="240px" />
        ) : (
          <PlaceholderImage label={`Cover — ${cover.title}`} />
        ))}
      {active === 'about' &&
        (site.portraitImage ? (
          <Image
            className={styles.media}
            src={site.portraitImage}
            alt=""
            fill
            sizes="240px"
          />
        ) : (
          <PlaceholderImage label="Portrait — public/images/portrait.jpg" />
        ))}
    </div>
  );
}
