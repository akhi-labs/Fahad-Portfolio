import Image from 'next/image';
import { PlaceholderImage } from '@/components/shared/PlaceholderImage';
import coverBlur from '@/lib/coverBlur.json';
import type { Project } from '@/lib/types';
import styles from './ProjectCover.module.css';

export function ProjectCover({ project }: { project: Project }) {
  return (
    <section className={styles.cover}>
      {project.image ? (
        <Image
          className={styles.coverMedia}
          src={project.image}
          alt={project.title}
          data-parallax="0.055"
          fill
          priority
          sizes="100vw"
          placeholder="blur"
          blurDataURL={(coverBlur as Record<string, string>)[project.slug]}
        />
      ) : (
        <PlaceholderImage
          className={styles.coverMedia}
          label={`Cover — public/work/${project.slug}/cover.jpg`}
          parallax="0.055"
        />
      )}
    </section>
  );
}
