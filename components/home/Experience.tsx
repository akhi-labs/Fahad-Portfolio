'use client';

import { useGridStagger } from '@/components/hooks/useGridStagger';
import { SectionTitleRow } from '@/components/shared/SectionTitleRow';
import { experience } from '@/lib/profile';
import styles from './Experience.module.css';

export function Experience() {
  const gridRef = useGridStagger();

  return (
    <section className="section shell" id="experience">
      <SectionTitleRow
        lines={['EXPERIENCE']}
        right={<span className="tiny muted">SELECTED / 2016—PRESENT</span>}
      />
      <div ref={gridRef} className={styles.grid}>
        {experience.map((item, i) => (
          <article key={`${item.brand}-${item.role}-${i}`} className={styles.card}>
            <div className={styles.top}>
              <span className={styles.year}>{item.year}</span>
              {i === 0 && (
                <span className={styles.current}>
                  <span className={styles.dot} />
                  Current
                </span>
              )}
            </div>
            <div className={styles.body}>
              <h3>{item.role}</h3>
              <span className={styles.brand}>{item.brand}</span>
              {item.description && <p>{item.description}</p>}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
