import { z } from 'zod';
import { serviceSchema, galleryItemSchema, type Service, type GalleryItem } from '@kpil/shared';

const SITE_URL = 'https://kpilr-men.fr';

const servicesArraySchema = z.array(serviceSchema);
const galleryArraySchema = z.array(galleryItemSchema);

const STATIC_PAGES: Array<{
  path: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}> = [
  { path: '', changefreq: 'weekly', priority: 1 },
  { path: '/presentation', changefreq: 'monthly', priority: 0.9 },
  { path: '/soins', changefreq: 'weekly', priority: 0.9 },
  { path: '/temoignages', changefreq: 'weekly', priority: 0.7 },
  { path: '/galerie', changefreq: 'weekly', priority: 0.8 },
  { path: '/contact', changefreq: 'yearly', priority: 0.6 },
  { path: '/rendez-vous', changefreq: 'yearly', priority: 0.8 },
];

async function fetchServices(): Promise<Service[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!baseUrl) return [];
  try {
    const res = await fetch(`${baseUrl}/services`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    return servicesArraySchema.parse(await res.json());
  } catch {
    return [];
  }
}

async function fetchGallery(): Promise<GalleryItem[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!baseUrl) return [];
  try {
    const res = await fetch(`${baseUrl}/gallery`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    return galleryArraySchema.parse(await res.json());
  } catch {
    return [];
  }
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function buildImageBlock(loc: string, title: string | null, caption: string | null): string {
  const parts = [`    <image:image>`, `      <image:loc>${escapeXml(loc)}</image:loc>`];
  if (title) parts.push(`      <image:title>${escapeXml(title)}</image:title>`);
  if (caption) parts.push(`      <image:caption>${escapeXml(caption)}</image:caption>`);
  parts.push(`    </image:image>`);
  return parts.join('\n');
}

function buildServiceImages(services: Service[]): string {
  return services
    .filter((s): s is Service & { image: string } => Boolean(s.image))
    .map((s) => buildImageBlock(s.image, s.imageTitle ?? s.title, s.imageAlt ?? s.title))
    .join('\n');
}

function buildGalleryImages(items: GalleryItem[]): string {
  return items
    .flatMap((item) => {
      const title = item.imageTitle ?? item.title;
      const altBase = item.imageAlt ?? item.title;
      const isBeforeAfter = item.type === 'before_after' && Boolean(item.afterImage);
      const blocks = [
        buildImageBlock(item.beforeImage, title, isBeforeAfter ? `${altBase} – avant` : altBase),
      ];
      if (isBeforeAfter && item.afterImage) {
        blocks.push(buildImageBlock(item.afterImage, title, `${altBase} – après`));
      }
      return blocks;
    })
    .join('\n');
}

export async function GET(): Promise<Response> {
  const [services, gallery] = await Promise.all([fetchServices(), fetchGallery()]);

  const lastmod = new Date().toISOString();
  const imagesByPath: Record<string, string> = {
    '/soins': buildServiceImages(services),
    '/galerie': buildGalleryImages(gallery),
  };

  const urlEntries = STATIC_PAGES.map(({ path, changefreq, priority }) => {
    const loc = `${SITE_URL}${path}`;
    const images = imagesByPath[path];
    const imagesBlock = images ? `\n${images}` : '';
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>${imagesBlock}
  </url>`;
  }).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urlEntries}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
