'use client';

import { useGridStagger } from '@/components/hooks/useGridStagger';
import { SectionTitleRow } from '@/components/shared/SectionTitleRow';
import { skills } from '@/lib/profile';
import styles from './Stack.module.css';

export function Stack() {
  // One staggered entrance for the whole index rather than nine separate
  // reveals, matching the work grid and expertise cards.
  const gridRef = useGridStagger();

  return (
    <section className="section shell" id="stack">
      <SectionTitleRow
        lines={['FAVOURITE', 'STACK']}
        right={<span className="tiny muted">TOOLS CHANGE / PRINCIPLES DON&apos;T</span>}
      />
      <div ref={gridRef} className={styles.grid}>
        {skills.map((item) => (
          <div key={item.name} className={styles.row}>
            <span className={styles.mark}>{item.icon}</span>
            <span className={styles.name}>{item.name}</span>
            <span className={styles.desc}>{item.description}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
