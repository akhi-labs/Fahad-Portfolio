'use client';

import { useReveal } from '@/components/hooks/useReveal';
import type { RowItem } from '@/lib/types';
import styles from './RowList.module.css';

function Row({ item }: { item: RowItem }) {
  const ref = useReveal();
  return (
    <div ref={ref} className={`${styles.row} reveal`}>
      <div className={styles.brand}>{item.brand}</div>
      <div className={styles.role}>{item.role}</div>
      <div className={styles.year}>{item.year}</div>
      <p>{item.description}</p>
    </div>
  );
}

export function RowList({ items }: { items: RowItem[] }) {
  return (
    <div className={styles.rows}>
      {items.map((item, i) => (
        <Row key={`${item.brand}-${item.role}-${i}`} item={item} />
      ))}
    </div>
  );
}
