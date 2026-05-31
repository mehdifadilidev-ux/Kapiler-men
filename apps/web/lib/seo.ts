import type { Metadata } from 'next';

const SITE_URL = 'https://kpilr-men.fr';
const SITE_NAME = "KPIL'R Men";
const OG_IMAGE = {
  url: '/assets/og-image.jpg',
  width: 1200,
  height: 630,
  alt: "KPIL'R Men — institut de prothèse capillaire à Orléans",
};

interface PageSeoInput {
  /** Page title. The document <title> gets "| KPIL'R Men" appended via the root template
   * (unless `absoluteTitle` is set). */
  title: string;
  description: string;
  /** Path without trailing slash. '' for the home page, '/soins', '/contact', etc. */
  path: string;
  /** Bypass the root title template — used by the home page so the brand is not doubled. */
  absoluteTitle?: boolean;
}

/**
 * Builds a complete, consistent Metadata object for a public page:
 * canonical URL, Open Graph and Twitter cards (with the dedicated 1200×630 image).
 *
 * Next.js does NOT deep-merge `openGraph`/`twitter` from parent segments, so every
 * page must declare the full set itself — this helper guarantees that.
 */
export function pageMetadata({ title, description, path, absoluteTitle }: PageSeoInput): Metadata {
  const url = `${SITE_URL}${path}`;
  const socialTitle = absoluteTitle ? title : `${title} | ${SITE_NAME}`;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: socialTitle,
      description,
      url,
      siteName: SITE_NAME,
      locale: 'fr_FR',
      type: 'website',
      images: [OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title: socialTitle,
      description,
      images: [OG_IMAGE.url],
    },
  };
}
