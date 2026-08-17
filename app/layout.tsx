import type { Metadata } from 'next';
import { PageChrome } from '@/components/chrome/PageChrome';
import { jsonLd, personSchema, websiteSchema } from '@/lib/schema';
import { site } from '@/lib/site';
import './globals.css';

const description =
  'Portfolio of Fahad Amjad, a UI/UX and graphic designer based in Rawalpindi / Islamabad with six years of experience across product interfaces, brand identity and campaign design.';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — UI/UX & Graphic Designer`,
    template: `%s — ${site.name}`,
  },
  description,
  alternates: { canonical: '/' },
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  keywords: [
    'UI/UX designer',
    'graphic designer',
    'product design',
    'brand identity',
    'Fahad Amjad',
    'Islamabad',
    'Pakistan',
  ],
  openGraph: {
    type: 'website',
    url: '/',
    siteName: site.name,
    locale: 'en_US',
    title: `${site.name} — UI/UX & Graphic Designer`,
    description:
      'Product interfaces, brand identity and campaign design by Fahad Amjad.',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${site.name} — UI/UX & Graphic Designer`,
    description:
      'Product interfaces, brand identity and campaign design by Fahad Amjad.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLd(personSchema(), websiteSchema())}
        />
        <PageChrome>{children}</PageChrome>
      </body>
    </html>
  );
}
