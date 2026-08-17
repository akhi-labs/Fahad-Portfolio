/**
 * Authoring-time script — NOT part of `next build`.
 *
 *   node scripts/branding-assets.mjs
 *
 * Reads ../Project_Assets/Branding, curates and resizes the usable images into
 * public/branding/{brand}/{tile,full}/NN.jpg, and generates lib/branding.ts.
 * Outputs are committed, exactly like public/work/ — nothing here runs at
 * request or build time.
 *
 * `sharp` is not a dependency of this site; it is borrowed from the sibling
 * html-to-design project purely for this one-off step, which is how every
 * previous asset import was done.
 */
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const sharp = require('d:/MY_AGENTIC_LEARNINGS/DOE_Framework/projects/html-to-design/node_modules/sharp');

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SITE = path.resolve(HERE, '..');
const SRC = path.resolve(SITE, '..', 'Project_Assets', 'Branding');
const OUT = path.join(SITE, 'public', 'branding');
const DATA = path.join(SITE, 'lib', 'branding.ts');

// Rows, in render order. `href` links a row label to an existing case study.
const ROWS = [
  {
    slug: 'iylus',
    label: 'IYLUS',
    href: '/work/iylus',
    // group directory -> how many to keep from it
    groups: [
      ['Iylus', 12],
      ['Iylus/posts', 4],
      ['Iylus/Pakaging', 8],
    ],
  },
  { slug: 'zigron', label: 'ZIGRON', groups: [['Zigron', 20]] },
  { slug: 'iyzil', label: 'IYZIL', groups: [['Iyzil', 8]] },
];

// Review escape hatch: add "Subfolder/Filename" entries here and re-run. Because
// caps apply after exclusions, dropping one file pulls the next candidate in.
const EXCLUDE = new Set([]);

const MIN_HEIGHT = 420; // floor for a 260px row once the optimizer picks a derivative
const MIN_RATIO = 0.62; // below this a tile reads as a sliver in a horizontal band

const TILE_HEIGHT = 460;
const FULL_BOUND = 1600;

const naturalSort = (a, b) => a.localeCompare(b, undefined, { numeric: true });

/** Evenly spaced pick across the whole list, so we never lose the tail. */
function stride(list, quota) {
  if (list.length <= quota) return list;
  const step = list.length / quota;
  return Array.from({ length: quota }, (_, i) => list[Math.floor(i * step)]);
}

async function collect(group) {
  const dir = path.join(SRC, group);
  const names = fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isFile() && /\.(jpe?g|png)$/i.test(e.name))
    .map((e) => e.name)
    .sort(naturalSort);

  const kept = [];
  for (const name of names) {
    const key = `${group}/${name}`;
    const file = path.join(dir, name);
    const meta = await sharp(file).metadata();
    const ratio = meta.width / meta.height;

    let drop = null;
    if (EXCLUDE.has(key)) drop = 'EXCLUDE list';
    else if (meta.height < MIN_HEIGHT) drop = `height ${meta.height} < ${MIN_HEIGHT}`;
    else if (ratio < MIN_RATIO) drop = `ratio ${ratio.toFixed(2)} < ${MIN_RATIO}`;

    if (drop) {
      console.log(`   drop  ${key}  (${meta.width}x${meta.height})  — ${drop}`);
      continue;
    }
    kept.push({ file, key });
  }
  return kept;
}

async function main() {
  fs.rmSync(OUT, { recursive: true, force: true });

  const rows = [];
  let tileBytes = 0;
  let fullBytes = 0;

  for (const row of ROWS) {
    console.log(`\n=== ${row.label} ===`);
    let picks = [];
    for (const [group, quota] of row.groups) {
      const eligible = await collect(group);
      const chosen = stride(eligible, quota);
      console.log(`   ${group}: ${eligible.length} eligible -> keeping ${chosen.length}`);
      picks = picks.concat(chosen);
    }

    const tileDir = path.join(OUT, row.slug, 'tile');
    const fullDir = path.join(OUT, row.slug, 'full');
    fs.mkdirSync(tileDir, { recursive: true });
    fs.mkdirSync(fullDir, { recursive: true });

    const images = [];
    for (const [i, pick] of picks.entries()) {
      const name = `${String(i + 1).padStart(2, '0')}.jpg`;
      const tileOut = path.join(tileDir, name);
      const fullOut = path.join(fullDir, name);

      // Tiles resize by HEIGHT: they render at a fixed row height with intrinsic
      // width, so a max-dimension bound would starve the wide packaging shots.
      const info = await sharp(pick.file)
        .rotate()
        .resize({ height: TILE_HEIGHT, withoutEnlargement: true })
        .jpeg({ quality: 78, mozjpeg: true })
        .toFile(tileOut);

      await sharp(pick.file)
        .rotate()
        .resize({ width: FULL_BOUND, height: FULL_BOUND, fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 80, mozjpeg: true })
        .toFile(fullOut);

      tileBytes += fs.statSync(tileOut).size;
      fullBytes += fs.statSync(fullOut).size;

      images.push({
        tile: `/branding/${row.slug}/tile/${name}`,
        full: `/branding/${row.slug}/full/${name}`,
        width: info.width,
        height: info.height,
      });
    }

    console.log(`   -> ${images.length} tiles written`);
    rows.push({ slug: row.slug, label: row.label, href: row.href, images });
  }

  const body = rows
    .map((row) => {
      const head = [
        `    slug: '${row.slug}',`,
        `    label: '${row.label}',`,
        row.href ? `    href: '${row.href}',` : null,
        '    images: [',
      ].filter(Boolean);
      const imgs = row.images.map(
        (im) =>
          `      { tile: '${im.tile}', full: '${im.full}', width: ${im.width}, height: ${im.height} },`,
      );
      return ['  {', ...head, ...imgs, '    ],', '  },'].join('\n');
    })
    .join('\n');

  fs.writeFileSync(
    DATA,
    `// GENERATED by scripts/branding-assets.mjs — do not edit by hand.
// Sources: ../Project_Assets/Branding/{Iylus,Zigron,Iyzil}. Curation rules and
// the EXCLUDE list live in that script; re-run it to regenerate.
import type { BrandRow } from './types';

export const BRANDS: BrandRow[] = [
${body}
];
`,
    'utf8',
  );

  const total = rows.reduce((n, r) => n + r.images.length, 0);
  console.log(
    `\nwrote ${total} tiles — ${(tileBytes / 1024 / 1024).toFixed(2)}MB tiles + ` +
      `${(fullBytes / 1024 / 1024).toFixed(2)}MB full = ` +
      `${((tileBytes + fullBytes) / 1024 / 1024).toFixed(2)}MB`,
  );
  console.log(`generated ${path.relative(SITE, DATA)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
