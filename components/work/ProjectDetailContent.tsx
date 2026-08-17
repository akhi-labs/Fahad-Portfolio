import type { Project } from '@/lib/types';
import { DetailSections } from './DetailSections';
import { MoreMarquee } from './MoreMarquee';
import { NextGrid } from './NextGrid';
import { Process } from './Process';
import { ProjectCover } from './ProjectCover';
import { ProjectHero } from './ProjectHero';

type ProjectDetailContentProps = {
  project: Project;
  next: Project[];
};

export function ProjectDetailContent({ project, next }: ProjectDetailContentProps) {
  return (
    <>
      <ProjectHero project={project} />
      <ProjectCover project={project} />
      <Process project={project} />
      <DetailSections project={project} />
      <MoreMarquee />
      <NextGrid projects={next} />
    </>
  );
}
