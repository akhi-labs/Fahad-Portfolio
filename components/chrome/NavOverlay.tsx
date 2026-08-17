'use client';

import Link from 'next/link';
import { navLinks, site } from '@/lib/site';
import { NavPreview } from './NavPreview';
import { TransitionLink } from './TransitionLink';
import styles from './NavOverlay.module.css';

type NavOverlayProps = {
  open: boolean;
  onClose: () => void;
};

export function NavOverlay({ open, onClose }: NavOverlayProps) {
  return (
    <nav className={styles.overlay} aria-label="Main navigation">
      <div className={styles.head}>
        <button
          type="button"
          className={styles.close}
          aria-label="Close navigation"
          onClick={onClose}
        >
          ×
        </button>
      </div>
      <div className={styles.list} data-nav-list>
        {navLinks.map((link) => {
          const inner = <span className={styles.name}>{link.label}</span>;
          // CONTACT has no natural image, so it gets no preview.
          const preview = link.label === 'CONTACT' ? undefined : link.label.toLowerCase();
          return link.transition ? (
            <TransitionLink
              key={link.label}
              href={link.href}
              onClick={onClose}
              data-preview={preview}
            >
              {inner}
            </TransitionLink>
          ) : (
            <Link
              key={link.label}
              href={link.href}
              onClick={onClose}
              data-preview={preview}
            >
              {inner}
            </Link>
          );
        })}
      </div>
      <div className={styles.foot}>
        <span>
          © {site.year} / {site.name}
        </span>
        <a href={site.dribbble} target="_blank" rel="noreferrer">
          Dribbble
        </a>
      </div>
      <NavPreview open={open} />
    </nav>
  );
}
