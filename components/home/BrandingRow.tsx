'use client';

import Image from 'next/image';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { TransitionLink } from '@/components/chrome/TransitionLink';
import type { BrandImage, BrandRow } from '@/lib/types';
import styles from './Branding.module.css';

/** Widest tile allowed, as a multiple of the row height. Nothing in the current
 *  set reaches it (the widest is 2.94) — it is a guard against a future asset. */
const MAX_RATIO = 3.2;
const MIN_RATIO = 0.62;

export type RowHandle = {
  setX: (x: number) => void;
  setWidth: number;
  x: number;
};

type BrandingRowProps = {
  row: BrandRow;
  index: number;
  /** Registers this row's track with the parent's animation loop. */
  onTrack: (index: number, track: HTMLDivElement | null, setWidth: number) => void;
  /** Flipped on once the band nears the viewport, to force the tiles to load. */
  warm: boolean;
  onOpen: (row: number, index: number, trigger: HTMLElement) => void;
  /** Holds this row still while the pointer is over it. */
  onHover: (index: number, isHovering: boolean) => void;
};

function tileWidth(image: BrandImage, ratioVar: string) {
  const ratio = Math.min(Math.max(image.width / image.height, MIN_RATIO), MAX_RATIO);
  return { width: `calc(${ratioVar} * ${ratio.toFixed(4)})` };
}

export function BrandingRow({
  row,
  index: rowIndex,
  onTrack,
  warm,
  onOpen,
  onHover,
}: BrandingRowProps) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const setRef = useRef<HTMLDivElement | null>(null);
  const [copies, setCopies] = useState(2);

  // Enough copies that the wrap never exposes a gap on a wide monitor. Iyzil's
  // eight tiles are the case that needs more than two.
  const measure = useCallback(() => {
    const track = trackRef.current;
    const set = setRef.current;
    if (!track || !set) return;

    const setWidth = set.getBoundingClientRect().width;
    if (setWidth <= 0) return;

    const needed = Math.max(2, Math.ceil(window.innerWidth / setWidth) + 1);
    setCopies((current) => Math.max(current, needed));
    onTrack(rowIndex, track, setWidth);
  }, [onTrack, rowIndex]);

  useLayoutEffect(() => {
    measure();
  }, [measure, copies]);

  useEffect(() => {
    let frame = 0;
    const onResize = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', onResize);
    };
  }, [measure]);

  // Unregister only on real unmount. Folding this into the effect above would
  // let its cleanup run after the layout effect that registers, leaving the
  // track nulled at the end of every commit.
  useEffect(() => {
    return () => onTrack(rowIndex, null, 0);
  }, [onTrack, rowIndex]);

  const label = row.href ? (
    <TransitionLink href={row.href} className={styles.labelLink} data-cursor="view">
      {row.label}
    </TransitionLink>
  ) : (
    row.label
  );

  return (
    <div>
      <div className="shell">
        <div className={`${styles.label} tiny muted`}>{label}</div>
      </div>
      <div
        className={styles.viewport}
        onPointerEnter={(event) => {
          // Touch pointers fire enter on tap and would leave the row frozen.
          if (event.pointerType === 'mouse') onHover(rowIndex, true);
        }}
        onPointerLeave={() => onHover(rowIndex, false)}
      >
        <div ref={trackRef} className={styles.track}>
          {Array.from({ length: copies }, (_, copy) => {
            const isClone = copy > 0;
            return (
              <div
                key={copy}
                ref={copy === 0 ? setRef : undefined}
                className={styles.set}
                // Clones are removed from the tab order and the a11y tree, so
                // keyboard users don't traverse 100+ duplicated controls.
                {...(isClone ? { inert: true } : {})}
              >
                {row.images.map((image, index) =>
                  isClone ? (
                    <div
                      key={image.tile}
                      className={styles.tile}
                      style={tileWidth(image, 'var(--tile-h)')}
                    >
                      <Image
                        className={styles.tileImg}
                        src={image.tile}
                        alt=""
                        width={image.width}
                        height={image.height}
                        loading={warm ? 'eager' : 'lazy'}
                        sizes="(max-width: 650px) 240px, (max-width: 900px) 320px, 420px"
                      />
                    </div>
                  ) : (
                    <button
                      key={image.tile}
                      type="button"
                      className={styles.tile}
                      style={tileWidth(image, 'var(--tile-h)')}
                      aria-label={`${row.label} — open image ${index + 1} of ${row.images.length}`}
                      onClick={(event) => onOpen(rowIndex, index, event.currentTarget)}
                    >
                      <Image
                        className={styles.tileImg}
                        src={image.tile}
                        alt=""
                        width={image.width}
                        height={image.height}
                        loading={warm ? 'eager' : 'lazy'}
                        sizes="(max-width: 650px) 240px, (max-width: 900px) 320px, 420px"
                      />
                    </button>
                  ),
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
