'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { TransitionLink } from '@/components/chrome/TransitionLink';
import { useReveal } from '@/components/hooks/useReveal';
import coverBlur from '@/lib/coverBlur.json';
import type { Project } from '@/lib/types';
import { useHoverRipple } from './HoverRippleProvider';
import { PlaceholderImage } from './PlaceholderImage';
import styles from './WorkCard.module.css';

type WorkCardProps = {
  project: Project;
  variant?: 'grid' | 'next';
  /** Off when a parent drives the entrance as one staggered group. */
  reveal?: boolean;
};

export function WorkCard({ project, variant = 'grid', reveal = true }: WorkCardProps) {
  const ref = useReveal<HTMLAnchorElement>();
  const mediaRef = useRef<HTMLDivElement>(null);
  const ripple = useHoverRipple();
  const image = project.image;

  useEffect(() => {
    const el = mediaRef.current;
    if (!el || !ripple || !image) return;
    if (!window.matchMedia('(pointer:fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;

    const onEnter = () => ripple.activate(el, image);
    const onMove = (e: PointerEvent) => ripple.pointerMove(el, e.clientX, e.clientY);
    const onLeave = () => ripple.deactivate(el);

    el.addEventListener('pointerenter', onEnter);
    el.addEventListener('pointermove', onMove, { passive: true });
    el.addEventListener('pointerleave', onLeave);

    return () => {
      el.removeEventListener('pointerenter', onEnter);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      // The card unmounts on route change while the provider persists, so
      // release the canvas even when no pointerleave fired.
      ripple.deactivate(el);
    };
  }, [ripple, image]);

  return (
    <TransitionLink
      ref={reveal ? ref : undefined}
      href={`/work/${project.slug}`}
      className={reveal ? `${styles.card} reveal` : styles.card}
      data-cursor="view"
    >
      <div
        ref={mediaRef}
        className={
          variant === 'next' ? `${styles.media} ${styles.nextMedia}` : styles.media
        }
      >
        {image ? (
          <Image
            className={styles.mediaInner}
            src={image}
            alt={`Cover — ${project.title}`}
            fill
            sizes="(max-width: 650px) 100vw, 50vw"
            // Without this a dark cover reads as an empty box until the
            // optimizer returns — most visible on the heaviest images.
            placeholder="blur"
            blurDataURL={(coverBlur as Record<string, string>)[project.slug]}
          />
        ) : (
          <PlaceholderImage
            className={styles.mediaInner}
            label={`Cover — ${project.title}`}
          />
        )}
      </div>
      <div className={styles.info}>
        <div className={styles.title}>{project.title}</div>
        {/* Only rendered once real category/year data exists. */}
        {(project.category || project.year) && (
          <div className={styles.side}>
            {project.category && <span>{project.category}</span>}
            {project.year && <span>{project.year}</span>}
          </div>
        )}
      </div>
    </TransitionLink>
  );
}
