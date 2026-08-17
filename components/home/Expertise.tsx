'use client';

import { useGridStagger } from '@/components/hooks/useGridStagger';
import { useHeadingStagger } from '@/components/hooks/useHeadingStagger';
import { splitWords } from '@/components/shared/splitWords';
import { expertise } from '@/lib/profile';
import styles from './Expertise.module.css';

export function Expertise() {
  const headerRef = useHeadingStagger();
  const gridRef = useGridStagger();

  return (
    <section className="section shell" id="expertise">
      <div ref={headerRef} className={styles.header}>
        <h2 className="section-title">
          <span>{splitWords('MY')}</span>
          <span>{splitWords('EXPERTISE')}</span>
        </h2>
        <span className="tiny muted" data-heading-extra>
          SELECTED CAPABILITIES
        </span>
      </div>
      <div ref={gridRef} className={styles.grid}>
        {expertise.map((item) => (
          <article key={item.title} className={styles.card}>
            <div className={styles.body}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
