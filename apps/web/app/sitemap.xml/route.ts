import { z } from 'zod';
import { serviceSchema, type Service } from '@kpil/shared';

const SITE_URL = 'https://kpilr-men.fr';

const servicesArraySchema = z.array(serviceSchema);

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

export async function GET(): Promise<Response> {
  const services = await fetchServices();
  const lastmod = new Date().toISOString();
  const soinsImages = services
    .filter((service): service is Service & { image: string } => Boolean(service.image))
    .map((service) =>
      buildImageBlock(service.image, service.imageTitle ?? service.title, service.imageAlt ?? service.title),
    )
    .join('\n');

  const urlEntries = STATIC_PAGES.map(({ path, changefreq, priority }) => {
    const loc = `${SITE_URL}${path}`;
    const imagesBlock = path === '/soins' && soinsImages ? `\n${soinsImages}` : '';
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
