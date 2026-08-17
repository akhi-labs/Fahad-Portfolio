import { WorkCard } from '@/components/shared/WorkCard';
import type { Project } from '@/lib/types';
import styles from './NextGrid.module.css';

export function NextGrid({ projects }: { projects: Project[] }) {
  return (
    <section className={styles.nextGrid}>
      {projects.map((project) => (
        <WorkCard key={project.slug} project={project} variant="next" />
      ))}
    </section>
  );
}
