# Fahad Amjad — Portfolio

Portfolio site for Fahad Amjad, UI/UX & graphic designer. Next.js, deployed on Vercel.

- **Stack:** Next.js 16 (App Router), React 19, TypeScript, plain CSS + CSS Modules.
- **Runtime deps:** `next`, `react`, `react-dom`, `gsap`, `@gsap/react`, `ogl`. Nothing else.
- **Routes:** `/` (one page, anchor-linked sections) and `/work/<slug>` — 7 statically generated case studies. Plus `sitemap.xml`, `robots.txt`, `icon.svg`.
- **Everything prerenders.** There is no server runtime; the whole site is static/SSG.

## Run locally

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
npm run lint
npx tsc --noEmit
```

`next/image` optimises on demand in dev, so a large cover can take a moment to appear the first time. Check `npm run build && npm run start` before judging load behaviour.

## Deploying to Vercel

The repo root **is** the Next.js app, so no Root Directory override is needed.

1. [vercel.com/new](https://vercel.com/new) → import this repo. Framework preset, build command and output are all auto-detected.
2. Add the environment variable below (optional but recommended — see *Contact form*).
3. Deploy. Every push to `main` redeploys.

After the first deploy, set `url` in `lib/site.ts` to the real domain — every canonical tag, Open Graph URL, sitemap entry and JSON-LD `@id` derives from that one value.

## Contact form — one setup step

The form in the footer is functional, but needs a free key to deliver to Fahad's inbox:

1. Go to [web3forms.com](https://web3forms.com), enter `fahad.amjad2211@gmail.com`, and they email an access key. No account, no domain verification.
2. Set it on Vercel as `NEXT_PUBLIC_WEB3FORMS_KEY` (or paste it into `contactFormKey` in `lib/site.ts`).

The key is public by design — it only ever posts to the address it was issued for.

**Without the key the form still works**: it validates, then opens the visitor's mail client with the message pre-filled and addressed to Fahad. So it degrades to something useful rather than failing silently.

## Where the content lives

| File | Holds |
|---|---|
| `lib/site.ts` | Name, role, email, phone, location, Dribbble, deployed URL, contact-form key |
| `lib/projects.ts` | The 7 case studies — copy, image paths, live links |
| `lib/profile.ts` | Expertise, tools/skills, work experience |
| `lib/branding.ts` | **Generated** — do not hand-edit (see below) |

All copy is plain TypeScript. No CMS — edit, save, redeploy.

## Images

**Case studies** — `public/work/<slug>/`, one folder per project: `cover.jpg` (grid thumbnail *and* the page hero) plus `detail-N.jpg`. Detail counts vary per project; the layout adapts to whatever it's given.

**Branding band** — `public/branding/<brand>/{tile,full}/NN.jpg`, generated. To re-import after changing the source assets:

```bash
node scripts/branding-assets.mjs
```

That script curates, resizes and rewrites `lib/branding.ts`. Its exclusion rules (minimum height, minimum aspect ratio) and a manual `EXCLUDE` list live at the top of the file; it logs every dropped file and why.

**Site-level** — `public/images/portrait.jpg` (About), imported from `../Person_Data/`.

Source assets live outside this repo in `../Project_Assets/` and `../Person_Data/`, and are resized on import with `sharp` as a one-off authoring step. `sharp` is deliberately **not** a dependency of this site.

## Still needs Fahad's input

- **Project `year` fields** are empty across all 7 case studies — the briefs didn't include dates. Empty fields hide themselves, so the meta row just omits them until filled.
- **Process copy** (`research` / `design` / `development`) is empty for every project. The briefs describe each *product*, not Fahad's process, so it was left blank rather than invented. Fill any one and the three-card process section appears automatically.
- **Iylus and Worker Shield have no live URL** in their briefs, so no LIVE PROJECT row on those two pages.
- **Branding section copy** — the section lead and the three row labels (IYLUS / ZIGRON / IYZIL) are the only editorial text written for that section; everything else is verifiable from the asset folders.
- **`p-mark`-style ambiguity**: the branding row for Iylus links to `/work/iylus`, which is also one of the 7 case studies. That cross-link is intentional.

## Project layout

```
app/
  layout.tsx            root layout, metadata, JSON-LD, mounts PageChrome
  page.tsx              home page composition
  globals.css           design tokens, resets, shared utilities
  sitemap.ts robots.ts  generated from lib/projects.ts
  work/[slug]/page.tsx  generateStaticParams + generateMetadata
components/
  chrome/               loader, grain, cursor, topbar, nav overlay + preview,
                        transition curtain, parallax engine, gsapSetup
  hooks/                useReveal, useGridStagger, useHeadingStagger,
                        useMagnetic, useClock
  shared/               PlaceholderImage, WorkCard, RowList, SectionTitleRow,
                        HoverRipple provider/canvas
  home/                 one component per home section
  work/                 case-study sections
lib/
  webgl/                shaders + renderers for the hero liquid and card ripple
scripts/                authoring-time asset pipeline (not part of the build)
```

## Conventions worth knowing before editing

- **GSAP is centralised** in `components/chrome/gsapSetup.ts`. Import `gsap`/`useGSAP`/`ScrollTrigger` from there, never from the packages directly.
- **Use GSAP's transform names**, not CSS ones: `rotation` and `scaleX`/`scaleY`, never `rotate`/`scale`. `rotate` and `scale` are real CSS properties now, and GSAP will target those instead — which produces a console warning and, with `SplitText`, silently doubles a resting tilt.
- **`useGSAP` reverts its context on every dependency change.** For simple show/hide tweens driven by React state, use a plain `useEffect` + `gsap.to(..., { overwrite: 'auto' })`. Two `useGSAP` hooks sharing one element's scope will fight each other.
- **Persistent tickers and ScrollTriggers** (the branding marquee) also use a plain `useEffect` — a `useGSAP` revert would tear the loop down mid-flight.
- **Reduced motion is handled unevenly on purpose:** reveals rely on a CSS rest state, parallax and the marquee early-return in JS, and the custom cursor deliberately stays active.
- **No circles, no arrow glyphs.** Every interactive shape uses `border-radius: var(--radius)` (4px). Arrows (`↗ ↘ ↓ ↑ ←`) were removed site-wide; use words.
- **Scroll reveals:** add `className="reveal"` plus a ref from `useReveal()`. Fires once, never fades back out.
- **Full-bleed sections** (the branding band) must not use `.shell`, and must be siblings of other sections rather than nested — a negative-margin breakout out of `.shell` previously widened the whole document on mobile.
