'use client';

import Image from 'next/image';
import { useReveal } from '@/components/hooks/useReveal';
import { PlaceholderImage } from '@/components/shared/PlaceholderImage';
import type { Project } from '@/lib/types';
import styles from './DetailSections.module.css';

type FigureProps = {
  src?: string;
  label: string;
  alt: string;
  variant: 'wide' | 'wideLast' | 'grid';
};

function Figure({ src, label, alt, variant }: FigureProps) {
  const ref = useReveal<HTMLElement>();
  const className =
    variant === 'grid'
      ? styles.gridFigure
      : variant === 'wideLast'
        ? `${styles.wideFigure} ${styles.wideFigureLast}`
        : styles.wideFigure;

  return (
    <figure ref={ref} className={`${className} reveal`}>
      {src ? (
        <Image
          className={styles.media}
          src={src}
          alt={alt}
          fill
          sizes={variant === 'grid' ? '(max-width: 650px) 100vw, 50vw' : '100vw'}
        />
      ) : (
        <PlaceholderImage className={styles.media} label={label} />
      )}
    </figure>
  );
}

export function DetailSections({ project }: { project: Project }) {
  const conceptRef = useReveal();
  const dir = `public/work/${project.slug}`;
  const details = project.details ?? [];

  // Lead shot runs full width, then the rest pair up two-across. An odd one
  // left at the end goes full width again rather than sitting half-empty.
  const [lead, ...rest] = details.length > 0 ? details : [undefined];
  const pairs: (string | undefined)[][] = [];
  let trailing: string | undefined;
  for (let i = 0; i < rest.length; i += 2) {
    if (i + 1 < rest.length) pairs.push([rest[i], rest[i + 1]]);
    else trailing = rest[i];
  }

  // With no real images at all, keep the reference layout's shape.
  const usePlaceholders = details.length === 0;
  if (usePlaceholders) {
    pairs.push([undefined, undefined]);
    trailing = undefined;
  }

  return (
    <section className={styles.detailWide}>
      <Figure
        src={lead}
        label={`Detail 1 — ${dir}/detail-1.jpg`}
        alt={`${project.title} detail`}
        variant="wide"
      />
      {project.concept && (
        <div ref={conceptRef} className={`${styles.concept} reveal`}>
          <h2>CONCEPT</h2>
          <p>{project.concept}</p>
        </div>
      )}
      {pairs.map((pair, row) => (
        <div key={row} className={styles.detailGrid}>
          {pair.map((src, col) => (
            <Figure
              key={col}
              src={src}
              label={`Detail ${row * 2 + col + 2} — ${dir}/detail-${row * 2 + col + 2}.jpg`}
              alt={`${project.title} detail`}
              variant="grid"
            />
          ))}
        </div>
      ))}
      {(trailing || usePlaceholders) && (
        <Figure
          src={trailing}
          label={`Detail — ${dir}/detail-4.jpg`}
          alt={`${project.title} detail`}
          variant="wideLast"
        />
      )}
    </section>
  );
}
