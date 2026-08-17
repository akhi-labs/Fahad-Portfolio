'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { BrandRow } from '@/lib/types';
import styles from './BrandingLightbox.module.css';

type BrandingLightboxProps = {
  row: BrandRow;
  index: number;
  onClose: () => void;
  onNavigate: (delta: number) => void;
};

export function BrandingLightbox({ row, index, onClose, onNavigate }: BrandingLightboxProps) {
  // Which src has finished decoding, rather than a boolean that would need
  // resetting in an effect every time the image changes.
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);

  const image = row.images[index];
  const total = row.images.length;
  const loaded = loadedSrc === image?.full;

  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  // Warm the neighbours so arrow-key traversal feels instant. `window.Image`
  // rather than `Image` — importing next/image here would shadow the global.
  useEffect(() => {
    if (total < 2) return;
    for (const offset of [1, -1]) {
      const neighbour = row.images[(index + offset + total) % total];
      if (!neighbour) continue;
      const preload = new window.Image();
      preload.src = neighbour.full;
    }
  }, [row, index, total]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        onNavigate(1);
        return;
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        onNavigate(-1);
        return;
      }
      if (event.key === 'Home') {
        event.preventDefault();
        onNavigate(-index);
        return;
      }
      if (event.key === 'End') {
        event.preventDefault();
        onNavigate(total - 1 - index);
        return;
      }
      if (event.key !== 'Tab') return;

      // Only three controls exist, so cycling that known list is more robust
      // than a generic focusable-node query.
      const order = [closeRef.current, prevRef.current, nextRef.current].filter(
        (el): el is HTMLButtonElement => el !== null,
      );
      if (order.length < 2) {
        event.preventDefault();
        order[0]?.focus();
        return;
      }
      const current = order.indexOf(document.activeElement as HTMLButtonElement);
      const delta = event.shiftKey ? -1 : 1;
      const nextIndex = (current + delta + order.length) % order.length;
      event.preventDefault();
      order[nextIndex]?.focus();
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose, onNavigate, index, total]);

  // No `mounted` guard needed: this only ever renders after a click, so it is
  // never part of the server render and `document` is always available.
  if (!image) return null;

  return createPortal(
    <div
      ref={dialogRef}
      className={styles.backdrop}
      role="dialog"
      aria-modal="true"
      aria-label={`${row.label} — image ${index + 1} of ${total}`}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className={styles.bar}>
        <span className="tiny muted">{row.label}</span>
        <button
          ref={closeRef}
          type="button"
          className={styles.button}
          aria-label="Close"
          onClick={onClose}
        >
          ×
        </button>
      </div>

      <div className={styles.frame}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={styles.placeholder} src={image.tile} alt="" aria-hidden="true" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={image.full}
          className={loaded ? `${styles.full} ${styles.loaded}` : styles.full}
          src={image.full}
          alt={`${row.label} — image ${index + 1} of ${total}`}
          onLoad={() => setLoadedSrc(image.full)}
        />
      </div>

      <div className={styles.bar}>
        <span className="tiny muted">
          {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
        <div className={styles.controls}>
          <button
            ref={prevRef}
            type="button"
            className={styles.button}
            aria-label="Previous image"
            onClick={() => onNavigate(-1)}
          >
            Prev
          </button>
          <button
            ref={nextRef}
            type="button"
            className={styles.button}
            aria-label="Next image"
            onClick={() => onNavigate(1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
