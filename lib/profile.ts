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

// Descriptors are deliberately terse — they sit inline beside the tool name in a
// compact index, not in a card with room for a sentence.
export const skills: SkillItem[] = [
  { icon: 'Ps', name: 'PHOTOSHOP', description: 'Retouching & compositing' },
  { icon: 'Ai', name: 'ILLUSTRATOR', description: 'Vector & icon sets' },
  { icon: 'Fg', name: 'FIGMA', description: 'Interface systems' },
  { icon: 'Xd', name: 'ADOBE XD', description: 'Prototyping & handoff' },
  { icon: 'Cv', name: 'CANVA', description: 'Social collateral' },
  { icon: 'Gm', name: 'GEMINI', description: 'Concepting & imagery' },
  { icon: 'Oa', name: 'OPENAI', description: 'Ideation & research' },
  { icon: 'Cl', name: 'CLAUDE', description: 'Writing & production' },
  { icon: 'St', name: 'GOOGLE STITCH', description: 'Layout generation' },
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
    brand: 'GS TECHNOLOGIES',
    role: 'UI&UX / GRAPHIC DESIGNER',
    year: '2020—22',
    description: '',
  },
  {
    brand: 'TURNOTECH INC.',
    role: 'GRAPHIC DESIGNER',
    year: '2019—21',
    description: '',
  },
  {
    // The former 2018—19 UI&UX role at MTBC is folded in here, so this one
    // spans both stints rather than splitting the same employer across cards.
    brand: 'MTBC',
    role: 'UI&UX / JR. GRAPHIC DESIGNER',
    year: '2017—19',
    description:
      'Interface and graphic design at a US-based healthcare IT company.',
  },
  {
    brand: 'MTBC',
    role: 'GRAPHIC INTERN',
    year: '2016—17',
    description: '',
  },
];

