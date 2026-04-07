# SKILL — SEO Patterns (KPIL R Men)

## Objectif

Ce skill définit les patterns SEO à appliquer systématiquement sur chaque page publique du site. Claude Code doit les intégrer dès la création d'une page, sans attendre qu'on le demande.

---

## Checklist par page publique

Chaque page publique DOIT avoir :

1. ✅ Export `metadata` ou `generateMetadata`
2. ✅ Un seul `<h1>` unique et descriptif
3. ✅ `next/image` pour toutes les images
4. ✅ `next/link` pour toute navigation interne
5. ✅ JSON-LD si pertinent (accueil, prestations)
6. ✅ Balise canonical (gérée automatiquement par Next.js si `metadataBase` est défini)

---

## Metadata — Template

### Metadata statique

```typescript
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Titre de la page | KPIL R Men',
  description: 'Description pertinente de 150-160 caractères pour les moteurs de recherche.',
  openGraph: {
    title: 'Titre de la page | KPIL R Men',
    description: 'Description pour le partage social.',
    images: ['/assets/og-image.jpg'],
    type: 'website',
  },
};
```

### Metadata dynamique (pages avec données)

```typescript
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Titre dynamique | KPIL R Men`,
    description: `Description dynamique.`,
  };
}
```

### Layout racine — metadataBase

```typescript
// app/layout.tsx
export const metadata: Metadata = {
  metadataBase: new URL('https://www.kpilrmen.fr'),
  title: {
    default: 'KPIL R Men — Prothésiste capillaire',
    template: '%s | KPIL R Men',
  },
  description: 'Prothésiste capillaire spécialisé. Transformations naturelles, compléments capillaires sur mesure.',
  openGraph: {
    siteName: 'KPIL R Men',
    locale: 'fr_FR',
    type: 'website',
  },
};
```

---

## Images — next/image obligatoire

```typescript
// ✅ CORRECT
import Image from 'next/image';

<Image
  src="/assets/hero.jpg"
  alt="Transformation capillaire avant après"
  width={800}
  height={600}
  priority              // Uniquement pour les images above the fold
  className="..."
/>

// Pour les images Firebase Storage (URLs externes)
// Configurer next.config.js :
// images: { remotePatterns: [{ hostname: 'firebasestorage.googleapis.com' }] }

<Image
  src={item.beforeImage}   // URL Firebase
  alt={item.title}
  width={600}
  height={400}
  sizes="(max-width: 768px) 100vw, 50vw"
/>

// ❌ INTERDIT
<img src="/hero.jpg" alt="..." />
```

---

## JSON-LD — Données structurées

### Page d'accueil — LocalBusiness

```typescript
// app/page.tsx
export default function HomePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'KPIL R Men',
    description: 'Prothésiste capillaire spécialisé dans les transformations naturelles.',
    url: 'https://www.kpilrmen.fr',
    telephone: '+33...',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '...',
      addressLocality: '...',
      postalCode: '...',
      addressCountry: 'FR',
    },
    image: 'https://www.kpilrmen.fr/assets/og-home.jpg',
    priceRange: '€€',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '19:00',
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* ... contenu de la page */}
    </>
  );
}
```

### Page prestations — Service schema

```typescript
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Transformation Essentielle',
  description: '...',
  provider: {
    '@type': 'LocalBusiness',
    name: 'KPIL R Men',
  },
  offers: {
    '@type': 'Offer',
    price: '450',
    priceCurrency: 'EUR',
  },
};
```

---

## Sitemap & Robots

### Sitemap automatique

```typescript
// app/sitemap.ts
import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.kpilrmen.fr';

  // Pages statiques
  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 1 },
    { url: `${baseUrl}/prestations`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${baseUrl}/galerie`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/reserver`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
  ];

  return staticPages;
}
```

### Robots.txt

```typescript
// app/robots.ts
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/admin/',
    },
    sitemap: 'https://www.kpilrmen.fr/sitemap.xml',
  };
}
```

---

## Headings — Hiérarchie

- Un seul `<h1>` par page, unique et descriptif
- Hiérarchie logique : `<h1>` → `<h2>` → `<h3>` (pas de saut)
- Le `<h1>` doit contenir le mot-clé principal de la page
- Ne JAMAIS utiliser un heading pour le style — utiliser Tailwind

```typescript
// ✅ CORRECT
<h1 className="text-4xl font-semibold">Nos prestations capillaires</h1>
<h2 className="text-2xl font-semibold">Transformation Essentielle</h2>

// ❌ INTERDIT — h1 générique
<h1>Bienvenue</h1>

// ❌ INTERDIT — heading pour le style
<h3 className="text-sm">Petit texte</h3>  // Utiliser <p> + Tailwind
```

---

## Pages admin — Exclusion SEO

Les pages admin ne doivent JAMAIS être indexées :

```typescript
// app/admin/layout.tsx
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};
```
