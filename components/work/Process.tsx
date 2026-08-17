'use client';

import { useReveal } from '@/components/hooks/useReveal';
import type { Project } from '@/lib/types';
import styles from './Process.module.css';

function Card({ title, body }: { title: string; body: string }) {
  const ref = useReveal<HTMLElement>();
  return (
    <article ref={ref} className={`${styles.card} reveal`}>
      <h2>{title}</h2>
      <p>{body}</p>
    </article>
  );
}

export function Process({ project }: { project: Project }) {
  // Each phase appears only once it has real copy; the section disappears
  // entirely while all three are still empty.
  const cards = [
    { title: 'RESEARCH', body: project.research },
    { title: 'DESIGN', body: project.design },
    { title: 'DEVELOPMENT', body: project.development },
  ].filter((c) => c.body);

  if (cards.length === 0) return null;

  return (
    <section className={styles.process}>
      {cards.map((c) => (
        <Card key={c.title} title={c.title} body={c.body} />
      ))}
    </section>
  );
}
