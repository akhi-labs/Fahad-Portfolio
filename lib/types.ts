/** Everything but slug/title may be empty until Fahad's real copy lands; the UI
 *  hides any field that has no value yet. */
export type Project = {
  slug: string;
  title: string;
  category: string;
  year: string;
  client: string;
  statement: string;
  research: string;
  design: string;
  development: string;
  concept: string;
  /** Cover image path, by convention `/work/{slug}/cover.jpg`. While unset the
   *  card falls back to PlaceholderImage and the hover ripple stays off. */
  image?: string;
  /** Detail shots, by convention `/work/{slug}/detail-N.jpg`. Any number is
   *  fine — the detail section lays them out in pairs. */
  details?: string[];
  /** Live project URL, shown in the hero meta when present. */
  link?: string;
};

export type SkillItem = {
  icon: string;
  name: string;
  percent: string;
  description: string;
};

export type RowItem = {
  brand: string;
  role: string;
  year: string;
  description: string;
};

export type ExpertiseItem = {
  title: string;
  description: string;
};

/** One frame in a branding row. `width`/`height` are the tile's post-resize
 *  intrinsics — they reserve layout before the image loads, which keeps the
 *  marquee's set measurement correct on the first pass and CLS at zero. */
export type BrandImage = {
  tile: string;
  full: string;
  width: number;
  height: number;
};

/** A labelled marquee row. `href` links the label to a case study; only Iylus
 *  has one, since it is also one of the seven projects. */
export type BrandRow = {
  slug: string;
  label: string;
  href?: string;
  images: BrandImage[];
};
