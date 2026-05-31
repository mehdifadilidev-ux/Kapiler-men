# SKILL — SEO Patterns (KPIL R Men)

## Objectif

Ce skill définit les patterns SEO à appliquer systématiquement sur chaque page publique du site.

---

## Checklist par page publique

1. �� Export `metadata` via le helper `pageMetadata()` de `@/lib/seo`
2. ✅ Un seul `<h1>` unique et descriptif
3. ✅ `next/image` pour toutes les images
4. ✅ `next/link` pour toute navigation interne
5. ✅ JSON-LD si pertinent (accueil, soins)
6. ✅ Balise canonical **explicite** via `alternates.canonical`

> ⚠️ `metadataBase` NE génère PAS de canonical — il ne sert qu'à résoudre les URLs
> d'images OG relatives. Le canonical doit être déclaré explicitement (le helper
> `pageMetadata()` le fait). De même, Next.js ne fusionne PAS les sous-champs
> `openGraph`/`twitter` du parent : chaque page doit déclarer le set complet
> (d'où le helper).

---

## Metadata — Template

```typescript
export const metadata: Metadata = {
  title: 'Titre de la page | KPIL R Men',
  description: 'Description pertinente de 150-160 caractères.',
  openGraph: {
    title: 'Titre | KPIL R Men',
    description: 'Description pour le partage social.',
    images: ['/assets/og-image.jpg'],
    type: 'website',
  },
};
```

### Layout racine — metadataBase

```typescript
export const metadata: Metadata = {
  metadataBase: new URL('https://kpilr-men.fr'),
  title: {
    default: "KPIL'R Men — Prothésiste capillaire à Orléans",
    template: "%s | KPIL'R Men",
  },
  openGraph: { siteName: "KPIL'R Men", locale: 'fr_FR', type: 'website' },
};
```

---

## JSON-LD — HairSalon (accueil)

```typescript
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HairSalon',
  name: "KPIL'R Men",
  description: "Prothésiste capillaire spécialisé. Institut privé à Orléans.",
  url: 'https://kpilr-men.fr',
  telephone: '+33666972562',
  email: 'kpilr-men@outlook.fr',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '64 Quai des Augustins',
    addressLocality: 'Orléans',
    postalCode: '45100',
    addressCountry: 'FR',
  },
  priceRange: '€€',
  sameAs: [
    'https://www.instagram.com/kpilr_men/',
    'https://www.tiktok.com/@kpilr_men',
  ],
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Monday', opens: '09:30', closes: '19:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Tuesday', opens: '09:30', closes: '16:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Thursday', opens: '09:30', closes: '19:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Friday', opens: '09:30', closes: '19:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '09:00', closes: '18:00' },
  ],
};
```

---

## Sitemap — pages

```
/                   priority: 1     weekly
/presentation       priority: 0.9   monthly
/soins              priority: 0.9   weekly
/temoignages        priority: 0.7   weekly
/galerie            priority: 0.8   weekly
/contact            priority: 0.6   yearly
/rendez-vous        priority: 0.8   yearly
```

---

## Pages admin — Exclusion SEO

```typescript
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};
```
