'use client';

import { useReveal } from '@/components/hooks/useReveal';
import { SectionTitleRow } from '@/components/shared/SectionTitleRow';
import { skills } from '@/lib/profile';
import type { SkillItem } from '@/lib/types';
import styles from './Stack.module.css';

function Card({ item }: { item: SkillItem }) {
  const ref = useReveal();
  return (
    <div ref={ref} className={`${styles.card} reveal`}>
      <div className={styles.icon}>{item.icon}</div>
      <div>
        <h3>{item.name}</h3>
        <p>{item.description}</p>
      </div>
    </div>
  );
}

export function Stack() {
  return (
    <section className="section shell" id="stack">
      <SectionTitleRow
        lines={['FAVOURITE', 'STACK']}
        right={<span className="tiny muted">TOOLS CHANGE / PRINCIPLES DON&apos;T</span>}
      />
      <div className={styles.grid}>
        {skills.map((item) => (
          <Card key={item.name} item={item} />
        ))}
      </div>
    </section>
  );
}
