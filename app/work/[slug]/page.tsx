import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProjectDetailContent } from '@/components/work/ProjectDetailContent';
import { PROJECTS, getNextProjects, getProject } from '@/lib/projects';
import { jsonLd, projectBreadcrumb, projectSchema } from '@/lib/schema';

export function generateStaticParams() {
  return PROJECTS.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<'/work/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};

  // Falls back to a generic line until the real overview copy is written.
  const description =
    project.statement || `${project.title} — a design case study by Fahad Amjad.`;
  const url = `/work/${project.slug}`;

  return {
    title: project.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title: project.title,
      description,
      images: project.image ? [{ url: project.image }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description,
      images: project.image ? [project.image] : undefined,
    },
  };
}

export default async function ProjectPage({ params }: PageProps<'/work/[slug]'>) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  // Keyed so navigating straight from one project to another remounts the
  // subtree instead of reusing the previous project's reveal/parallax state.
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          projectSchema(project),
          projectBreadcrumb(project),
        )}
      />
      <ProjectDetailContent
        key={project.slug}
        project={project}
        next={getNextProjects(slug)}
      />
    </>
  );
}
