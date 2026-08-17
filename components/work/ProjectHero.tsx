'use client';

import { useReveal } from '@/components/hooks/useReveal';
import type { Project } from '@/lib/types';
import styles from './ProjectHero.module.css';

export function ProjectHero({ project }: { project: Project }) {
  const introRef = useReveal();
  const metaRef = useReveal();

  // Each row appears only once its field holds real data.
  const meta = [
    { label: 'CLIENT', value: project.client },
    { label: 'YEAR', value: project.year },
    { label: 'CATEGORY', value: project.category },
  ].filter((item) => item.value);

  return (
    <section className={styles.hero}>
      <h1>{project.title}</h1>
      {project.statement && (
        <div ref={introRef} className={`${styles.intro} reveal`}>
          <div className={styles.introLabel}>OVERVIEW</div>
          <p>{project.statement}</p>
        </div>
      )}
      {(meta.length > 0 || project.link) && (
        <div ref={metaRef} className={`${styles.meta} reveal`}>
          {meta.map((item) => (
            <div key={item.label} className={styles.metaItem}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
          {project.link && (
            <div className={styles.metaItem}>
              <span>LIVE PROJECT</span>
              <strong>
                <a
                  className={styles.link}
                  href={project.link}
                  target="_blank"
                  rel="noreferrer"
                >
                  {project.link.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                </a>
              </strong>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
