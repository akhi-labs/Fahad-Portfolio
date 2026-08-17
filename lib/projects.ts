import type { Project } from './types';

// Slugs and titles come from the Project_Assets folder names. Copy is condensed
// from each project's own overview brief in that folder — nothing is invented.
// Fields with no source data stay empty and the UI hides them.
//
// Images live at public/work/{slug}/, imported from Project_Assets and resized
// to a 2400px bound: cover.jpg (grid thumbnail + page hero) and detail-N.jpg.
// Detail counts vary per project; the detail section lays out whatever it gets.
//
// `research` / `design` / `development` drive the three process cards. The
// briefs describe each product, not Fahad's process, so they stay empty rather
// than being fabricated — the whole process section hides itself until filled.
//
// Array order defines the circular next-project links.
const detailPaths = (slug: string, count: number) =>
  Array.from({ length: count }, (_, i) => `/work/${slug}/detail-${i + 1}.jpg`);

export const PROJECTS: Project[] = [
  {
    slug: 'denta-smart',
    title: 'DENTA SMART',
    category: 'AI HEALTHCARE',
    year: '',
    client: 'DENTASMART.AI',
    link: 'https://dentasmart.ai/',
    image: '/work/denta-smart/cover.jpg',
    details: detailPaths('denta-smart', 7),
    statement:
      'An AI-powered dental health platform that works like a personal AI dentist in your pocket. Users upload teeth photos or dental X-rays and receive AI-based insights, an Oral Health Score and a care plan within minutes.',
    research: '',
    design: '',
    development: '',
    concept:
      'An AI dental screening and guidance platform: detect possible issues early, understand treatment options, estimate costs and arrive at the dentist with better questions. The value is convenience — dental insight from a phone, without waiting on an appointment.',
  },
  {
    slug: 'ebs',
    title: 'EBS',
    category: 'SECURITY TECH',
    year: '',
    client: 'EBS SMART SECURITY',
    link: 'https://ebssmart.com/',
    image: '/work/ebs/cover.jpg',
    details: detailPaths('ebs', 5),
    statement:
      'A security technology company built around smart alarm communication, remote monitoring and worker-safety solutions — for homes, businesses, security agencies, installers and public institutions.',
    research: '',
    design: '',
    development: '',
    concept:
      'A professional security platform that connects old and new alarm systems to modern apps, cloud services, cameras and monitoring centres — and lets companies track and protect field workers in real time.',
  },
  {
    slug: 'heliorix',
    title: 'HELIORIX',
    category: 'RENEWABLE ENERGY',
    year: '',
    client: 'HELIORIX.AI',
    link: 'https://heliorix.ai/',
    image: '/work/heliorix/cover.jpg',
    details: detailPaths('heliorix', 3),
    statement:
      'An AI-powered solar and renewable energy development platform for engineering, planning and development teams. Discover land, analyse constraints, and design with confidence.',
    research: '',
    design: '',
    development: '',
    concept:
      'A visual workspace that accelerates the early stages of utility-scale solar: identifying viable land parcels, automatically surfacing environmental, topographical and zoning constraints, and using AI agents to automate the slowest feasibility work.',
  },
  {
    slug: 'iylus',
    title: 'IYLUS',
    category: 'SMART SECURITY',
    year: '',
    client: 'IYLUS',
    image: '/work/iylus/cover.jpg',
    details: detailPaths('iylus', 4),
    statement:
      'A smart home and business security provider in Pakistan, positioned as a technology-driven alternative to traditional systems — smart hardware paired with professional 24/7 monitoring.',
    research: '',
    design: '',
    development: '',
    concept:
      'One connected ecosystem rather than isolated devices: cameras, video doorbell and smart lock managed from a single app, backed by a monitoring centre that verifies alarms with a real call and escalates to law enforcement when needed.',
  },
  {
    slug: 'mysentry',
    title: 'MYSENTRY',
    category: 'SAFETY APP',
    year: '',
    client: 'MYSENTRY.AI',
    link: 'https://mysentry.ai/',
    image: '/work/mysentry/cover.jpg',
    details: detailPaths('mysentry', 5),
    statement:
      'A personal safety app for women, families, seniors and lone workers. It helps people get help quickly, share their location and stay connected during unsafe or emergency situations.',
    research: '',
    design: '',
    development: '',
    concept:
      'A mobile and wearable safety platform combining emergency alerting, 24/7 monitoring support, location sharing, meeting check-ins, route protection and fall detection.',
  },
  {
    slug: 'stress-guru',
    title: 'STRESS GURU',
    category: 'MENTAL WELLNESS',
    year: '',
    client: 'STRESSGURU.AI',
    link: 'https://stressguru.ai/',
    image: '/work/stress-guru/cover.jpg',
    details: detailPaths('stress-guru', 4),
    statement:
      'An AI-driven mental wellness platform that helps people identify and manage stress before it becomes burnout, using Apple Watch signals to detect early warning signs and respond proactively.',
    research: '',
    design: '',
    development: '',
    concept:
      'Eight AI wellness coaches, each with its own focus — calm, anxiety, motivation, productivity — reachable the moment biometrics flag rising stress. Explicitly a support tool, not a clinical or crisis service.',
  },
  {
    slug: 'worker-shield',
    title: 'WORKER SHIELD',
    category: 'WORKFORCE SAFETY',
    year: '',
    client: 'WORKERSHIELD',
    image: '/work/worker-shield/cover.jpg',
    details: detailPaths('worker-shield', 4),
    statement:
      'A workforce safety and real-time monitoring platform for organisations managing field workers, operational tasks, safety events and alarms from one central system.',
    research: '',
    design: '',
    development: '',
    concept:
      'Replacing calls and spreadsheets with a live picture of the field: who is working, what they are assigned, checkpoint progress and safety alarms — surfaced across an organisational hierarchy so each level sees what it needs.',
  },
];

export function getProject(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}

/** The next two projects, wrapping around the end of the list. */
export function getNextProjects(slug: string): Project[] {
  const i = PROJECTS.findIndex((p) => p.slug === slug);
  if (i < 0) return [];
  return [PROJECTS[(i + 1) % PROJECTS.length], PROJECTS[(i + 2) % PROJECTS.length]];
}
