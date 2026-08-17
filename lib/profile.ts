import type { ExpertiseItem, RowItem, SkillItem } from './types';

export const expertise: ExpertiseItem[] = [
  {
    title: 'UI/UX DESIGN',
    description:
      'Product flows, wireframes and interface systems for web, mobile and dashboard applications.',
  },
  {
    title: 'GRAPHIC DESIGN',
    description:
      'Marketing material, posters, billboards and social campaign assets built on a consistent visual system.',
  },
  {
    title: 'BRAND IDENTITY',
    description:
      'Logo design and identity systems, from first mark exploration through to usable brand collateral.',
  },
  {
    title: 'PRINT & PACKAGING',
    description:
      'Packaging, print layout and production-ready artwork prepared in the Adobe Creative Suite.',
  },
  {
    title: 'ILLUSTRATION',
    description:
      'Vector illustration and photo retouching used to give campaigns and interfaces their own character.',
  },
];

// Percentages are taken directly from Fahad's resume.
export const skills: SkillItem[] = [
  {
    icon: 'Ps',
    name: 'PHOTOSHOP',
    percent: 'IMAGE EDITING / 80%',
    description: 'Retouching, compositing and campaign artwork.',
  },
  {
    icon: 'Fg',
    name: 'FIGMA',
    percent: 'PRODUCT DESIGN / 80%',
    description: 'Interface systems, components and prototypes.',
  },
  {
    icon: 'Lr',
    name: 'LIGHTROOM',
    percent: 'PHOTO / 80%',
    description: 'Colour grading and photographic consistency.',
  },
  {
    icon: 'Ai',
    name: 'ILLUSTRATOR',
    percent: 'VECTOR / 75%',
    description: 'Logos, icon sets and vector illustration.',
  },
  {
    icon: 'Xd',
    name: 'ADOBE XD',
    percent: 'PROTOTYPING / 70%',
    description: 'Interactive prototypes and design handoff.',
  },
  {
    icon: 'Id',
    name: 'INDESIGN',
    percent: 'LAYOUT / 65%',
    description: 'Editorial layout and print-ready documents.',
  },
];

// Roles and dates are from the resume. It gives no per-role detail beyond
// Zigron's and MTBC's industries, so the other descriptions are left empty
// rather than invented — the card hides the line until one is filled in.
export const experience: RowItem[] = [
  {
    brand: 'ZIGRON INC.',
    role: 'UI/UX DESIGNER',
    year: '2021—NOW',
    description:
      'Communication and product design for an IT company serving energy, telecom, healthcare, smart home and social-venture industries.',
  },
  {
    brand: 'TURNOTECH INC.',
    role: 'GRAPHIC DESIGNER',
    year: '2019—21',
    description: '',
  },
  {
    brand: 'MTBC',
    role: 'UI&UX / GRAPHIC DESIGNER',
    year: '2018—19',
    description:
      'Interface and graphic design at a US-based healthcare IT company.',
  },
  {
    brand: 'MTBC',
    role: 'JR. GRAPHIC DESIGNER',
    year: '2017—18',
    description: '',
  },
  {
    brand: 'MTBC',
    role: 'GRAPHIC INTERN',
    year: '2016—17',
    description: '',
  },
];

