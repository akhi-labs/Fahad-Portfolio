'use client';

import { useGridStagger } from '@/components/hooks/useGridStagger';
import { SectionTitleRow } from '@/components/shared/SectionTitleRow';
import { WorkCard } from '@/components/shared/WorkCard';
import { PROJECTS } from '@/lib/projects';
import styles from './WorkGrid.module.css';

export function WorkGrid() {
  // One choreographed entrance for the whole grid rather than seven
  // independent per-card reveals.
  const gridRef = useGridStagger();

  return (
    <section className="section shell" id="work">
      <SectionTitleRow
        lines={['MY', 'WORK']}
        right={
          <p className="section-lead">
            A selection of work that reflects my approach to design, from early
            ideas and exploration to polished final outcomes.
          </p>
        }
      />
      <div ref={gridRef} className={styles.grid}>
        {PROJECTS.map((project) => (
          <WorkCard key={project.slug} project={project} reveal={false} />
        ))}
      </div>
    </section>
  );
}
