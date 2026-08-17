import { PROJECTS } from './projects';
import { site } from './site';
import type { Project } from './types';

/**
 * JSON-LD for search engines. Kept as plain objects so each page can inline
 * exactly the graph it needs rather than shipping one blob everywhere.
 */

export function personSchema() {
  const [city, region] = site.location.split(' / ');
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: site.name,
    jobTitle: site.role,
    email: `mailto:${site.email}`,
    url: site.url,
    image: site.portraitImage ? `${site.url}${site.portraitImage}` : undefined,
    address: {
      '@type': 'PostalAddress',
      addressLocality: city,
      addressRegion: region?.replace(/,\s*PK$/, '').trim(),
      addressCountry: 'PK',
    },
    sameAs: [site.dribbble],
    knowsAbout: [
      'UI/UX Design',
      'Graphic Design',
      'Brand Identity',
      'Print & Packaging',
      'Illustration',
    ],
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: `${site.name} — Portfolio`,
    url: site.url,
    inLanguage: 'en',
    author: { '@type': 'Person', name: site.name },
  };
}

/** The work grid, so the case studies are discoverable as a set. */
export function portfolioSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Selected Work',
    url: `${site.url}/#work`,
    hasPart: PROJECTS.map((p) => ({
      '@type': 'CreativeWork',
      name: p.title,
      url: `${site.url}/work/${p.slug}`,
    })),
  };
}

export function projectSchema(project: Project) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    url: `${site.url}/work/${project.slug}`,
    description: project.statement || undefined,
    image: project.image ? `${site.url}${project.image}` : undefined,
    genre: project.category || undefined,
    creator: { '@type': 'Person', name: site.name, url: site.url },
    ...(project.client ? { client: project.client } : {}),
    ...(project.link ? { sameAs: [project.link] } : {}),
  };
}

/** Home > Work > <project>, for breadcrumb rich results. */
export function projectBreadcrumb(project: Project) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: site.url },
      { '@type': 'ListItem', position: 2, name: 'Work', item: `${site.url}/#work` },
      {
        '@type': 'ListItem',
        position: 3,
        name: project.title,
        item: `${site.url}/work/${project.slug}`,
      },
    ],
  };
}

/** Serialises a graph for a <script type="application/ld+json"> tag. */
export function jsonLd(...schemas: object[]) {
  return {
    __html: JSON.stringify(schemas.length === 1 ? schemas[0] : schemas).replace(
      /</g,
      '\\u003c',
    ),
  };
}
