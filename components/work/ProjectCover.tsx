import Image from 'next/image';
import { PlaceholderImage } from '@/components/shared/PlaceholderImage';
import coverBlur from '@/lib/coverBlur.json';
import imageMeta from '@/lib/imageMeta.json';
import type { Project } from '@/lib/types';
import styles from './ProjectCover.module.css';

const META = imageMeta as Record<string, { w: number; h: number }>;

export function ProjectCover({ project }: { project: Project }) {
  // Sized to the cover's own ratio rather than a fixed height — the widest
  // cover is 2.00 and was losing a third of its width to the old 1.32 band.
  const meta = project.image ? META[project.image] : undefined;

  return (
    <section
      className={styles.cover}
      style={meta ? { aspectRatio: meta.w / meta.h, height: 'auto' } : undefined}
    >
      {project.image ? (
        <Image
          className={styles.coverMedia}
          src={project.image}
          alt={project.title}
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
