'use client';

import Link from 'next/link';
import { useClock } from '@/components/hooks/useClock';
import { useMagnetic } from '@/components/hooks/useMagnetic';
import styles from './Topbar.module.css';

export function Topbar({ onOpenNav }: { onOpenNav: () => void }) {
  const time = useClock();
  const pillRef = useMagnetic<HTMLAnchorElement>();

  return (
    <header className={styles.topbar}>
      <div className={styles.localTime}>
        <span>LOCAL/</span>
        <span>{time}</span>
      </div>
      <button
        type="button"
        className={styles.navTrigger}
        aria-label="Open navigation"
        onClick={onOpenNav}
      >
        <span className={styles.dotGrid} aria-hidden="true">
          {Array.from({ length: 9 }, (_, i) => (
            <i key={i} />
          ))}
        </span>
      </button>
      <Link ref={pillRef} className={styles.pill} href="/#contact">
        CONTACT NOW
      </Link>
    </header>
  );
}
