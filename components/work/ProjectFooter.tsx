'use client';

import { useReveal } from '@/components/hooks/useReveal';
import styles from '@/components/Footer.module.css';
import { site } from '@/lib/site';

// Shorter than the home footer: no contact CTA, no image and no oversized
// name — just the discipline line and the bottom row.
export function ProjectFooter() {
  const statementRef = useReveal<HTMLParagraphElement>();

  return (
    <footer className={`${styles.footer} ${styles.footerCompact} shell`}>
      <p ref={statementRef} className={`${styles.statement} reveal`}>
        UI/UX DESIGN / GRAPHIC DESIGN / BRAND IDENTITY.
      </p>
      <div className={styles.bottom}>
        <div>
          © {site.year} {site.name.toUpperCase()}
        </div>
        <div>
          <a href={site.dribbble} target="_blank" rel="noreferrer">
            DRIBBBLE
          </a>{' '}
          ·{' '}
          <a href={site.resume} download>
            RÉSUMÉ
          </a>
        </div>
        <div>
          {/* Scrolls this project page to its own top, as in the reference. */}
          <a href="#">GO BACK TO TOP</a>
        </div>
      </div>
    </footer>
  );
}
