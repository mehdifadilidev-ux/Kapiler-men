# CLAUDE.md — KPIL R Men

## Projet

Site web pour un prothésiste capillaire. Le site présente les prestations, permet la prise de RDV via Planity, et offre un espace admin pour gérer le contenu dynamique (galerie avant/après, prestations).

---

## Stack technique

| Couche       | Techno                          |
|--------------|----------------------------------|
| Monorepo     | pnpm workspaces                  |
| Frontend     | Next.js 14 (App Router) + TypeScript |
| Styling      | Tailwind CSS                     |
| Data fetching| TanStack React Query (v5)        |
| State mgmt   | Zustand                          |
| Backend      | NestJS + TypeScript              |
| Base de données | PostgreSQL                    |
| Auth         | JWT HS256 (access + refresh)     |
| Upload       | Firebase Storage (signed URL)    |
| Validation   | Zod (shared DTOs front/back)     |
| SQL          | Raw queries via postgres.js — PAS d'ORM |
| Migrations   | SQL versionné (scripts manuels)  |
| Typage       | Strict — ZÉRO `any`, `unknown`, `as`, `!` |

---

## Structure monorepo

```
kpil-r-men/
├── pnpm-workspace.yaml
├── package.json
├── tsconfig.base.json
├── CLAUDE.md
├── packages/
│   └── shared/              # DTOs Zod, types, constantes
│       ├── src/
│       │   ├── dto/          # Schémas Zod partagés
│       │   ├── types/        # Types TypeScript
│       │   └── index.ts
│       └── package.json
├── apps/
│   ├── web/                  # Frontend Next.js (App Router)
│   │   ├── app/
│   │   │   ├── layout.tsx           # Root layout (fonts, metadata)
│   │   │   ├── page.tsx             # Accueil
│   │   │   ├── prestations/
│   │   │   │   └── page.tsx
│   │   │   ├── galerie/
│   │   │   │   └── page.tsx
│   │   │   ├── activite-2/
│   │   │   │   └── page.tsx
│   │   │   ├── activite-3/
│   │   │   │   └── page.tsx
│   │   │   ├── reserver/
│   │   │   │   └── page.tsx
│   │   │   └── admin/               # Layout admin protégé
│   │   │       ├── layout.tsx
│   │   │       ├── page.tsx          # Dashboard
│   │   │       ├── login/
│   │   │       │   └── page.tsx
│   │   │       ├── galerie/
│   │   │       │   └── page.tsx
│   │   │       └── services/
│   │   │           └── page.tsx
│   │   ├── components/
│   │   │   ├── ui/                   # Composants réutilisables
│   │   │   ├── gallery/              # Composants galerie avant/après
│   │   │   ├── services/             # Composants prestations
│   │   │   ├── layout/               # Header, Footer, Nav
│   │   │   └── providers/            # QueryClientProvider, etc.
│   │   ├── lib/
│   │   │   ├── api-client.ts         # Client HTTP typé (fetch wrapper, interceptors JWT)
│   │   │   ├── auth.ts               # Helpers JWT côté client
│   │   │   └── firebase.ts           # Config upload Firebase
│   │   ├── queries/                   # React Query hooks
│   │   │   ├── useGallery.ts         # useQuery/useMutation galerie
│   │   │   ├── useServices.ts        # useQuery/useMutation prestations
│   │   │   ├── useAuth.ts            # useMutation login/logout/refresh
│   │   │   ├── useUpload.ts          # useMutation signed URL + upload
│   │   │   └── queryKeys.ts          # Clés React Query centralisées
│   │   ├── stores/                    # Zustand stores
│   │   │   ├── useAuthStore.ts       # État auth (token, user, isAuthenticated)
│   │   │   └── useUIStore.ts         # État UI (sidebar, modals, toasts)
│   │   ├── hooks/                     # Hooks custom non-query
│   │   ├── types/                     # Types frontend-only (pas dans shared)
│   │   ├── public/
│   │   │   └── assets/               # Logo, images statiques
│   │   ├── next.config.js
│   │   ├── tailwind.config.ts
│   │   └── package.json
│   └── api/                  # Backend NestJS
│       ├── src/
│       │   ├── auth/         # Module auth JWT
│       │   ├── gallery/      # Module galerie avant/après
│       │   ├── services/     # Module prestations
│       │   ├── upload/       # Module signed URL Firebase Storage
│       │   ├── admin/        # Guards + routes admin
│       │   ├── database/     # Connexion postgres.js + helpers
│       │   ├── migrations/   # Fichiers SQL versionnés
│       │   └── main.ts
│       └── package.json
```

---

## Design System — Charte graphique KPIL R Men

### Palette de couleurs

```
--color-white:     #FFFFFF    /* Fonds clairs, texte sur fond sombre */
--color-black:     #000000    /* Texte principal, logo sur fond clair */
--color-gray:      #878787    /* Texte secondaire, éléments discrets */
--color-bois:      #BB7348    /* Accent principal / identité de marque */
--color-bois-15:   rgba(187, 115, 72, 0.15)  /* Fonds subtils, hover states */
```

### Tailwind — extension de config

```js
// tailwind.config.ts
colors: {
  white: '#FFFFFF',
  black: '#000000',
  gray: { DEFAULT: '#878787' },
  bois: {
    DEFAULT: '#BB7348',
    light: 'rgba(187, 115, 72, 0.15)',
  },
}
```

### Typographie

| Usage             | Police                        | Poids     |
|-------------------|-------------------------------|-----------|
| Titres            | Montserrat                    | SemiBold (600) |
| Sous-titres       | Montserrat                    | SemiBold (600), taille inférieure |
| Exergue           | Montserrat                    | Regular (400) |
| Texte courant     | Montserrat                    | Medium (500) |
| Texte secondaire  | Montserrat                    | Medium (500), taille réduite |
| Accent / signature| Bodoni Moda                   | SemiBold Italic (600) |
| Lettrage espacé   | Montserrat Light              | 300, letter-spacing: 0.5em |

### Import Google Fonts

```css
@import url('https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,wght@1,600&family=Montserrat:wght@300;400;500;600;700;800&display=swap');
```

### Logo

- Fond clair → logo noir
- Fond sombre → logo blanc
- Supports marketing (cartes, bannières) → logo blanc sur dégradé bois
- Petits formats (favicon, avatar) → version simplifiée sur dégradé bois

### Direction artistique

- Ambiance premium, masculine, sobre
- Beaucoup d'espace blanc / négatif
- Photos plein cadre pour les sections héros
- Transitions douces, animations subtiles
- Pas de surcharge visuelle — la couleur bois est l'accent, utilisée avec parcimonie

---

## Pages & Navigation

### Navigation principale

```
Accueil | Prestations | Galerie | [Activité 2] | [Activité 3] | Réserver
```

### 1. Accueil (`/`)

- Hero section plein écran avec photo + accroche + CTA "Réserver"
- Section "À propos" — présentation du prothésiste
- Aperçu des prestations (3 cards avec liens)
- Aperçu galerie avant/après (carrousel ou grille 3 photos)
- Section témoignages (placeholder)
- CTA final vers réservation
- Footer : coordonnées, horaires, liens, réseaux sociaux

### 2. Prestations (`/prestations`)

- Liste des prestations avec détail, durée, prix
- Données issues du PDF charte (Transformation Essentielle, Signature, etc.)
- Contenu géré dynamiquement via l'admin
- CTA "Réserver cette prestation" → page RDV

### 3. Galerie avant/après (`/galerie`)

- Grille de cards avant/après
- Chaque card : 2 photos (avant + après) + texte descriptif
- Slider ou toggle avant/après interactif
- Contenu 100% dynamique (CRUD admin)
- Placeholder si aucune photo n'est encore uploadée

### 4. Activité 2 (`/activite-2`) — Placeholder

- Page en attente de contenu
- Template prêt avec hero + sections modulaires
- Message "Coming soon" ou contenu placeholder

### 5. Activité 3 (`/activite-3`) — Placeholder

- Idem activité 2

### 6. Réserver (`/reserver`)

- Widget Planity embed intégré dans la page
- Lien externe vers la page Planity en complément
- Intégration via le script Planity white-label :

```js
window.planity = {
  key: '$API_KEY',              // Clé fournie par Planity
  primaryColor: '#BB7348',      // Couleur bois de la charte
  container: document.getElementById('planity-widget'),
};
```

Scripts à charger :
```
https://d2skjte8udjqxw.cloudfront.net/widget/production/2/polyfills.latest.js
https://d2skjte8udjqxw.cloudfront.net/widget/production/2/app.latest.js
```

> **Note** : Le widget Planity utilise `window` et doit être chargé côté client uniquement.
> Encapsuler dans un composant `'use client'` avec un `useEffect` ou un dynamic import `next/dynamic` avec `ssr: false`.

---

## SEO & Stratégie de rendu

### Rendu par page

| Page             | Stratégie     | Raison                                      |
|------------------|---------------|----------------------------------------------|
| Accueil          | SSG           | Contenu semi-statique, revalidation ISR      |
| Prestations      | SSG + ISR     | Contenu dynamique admin, revalidate: 60s     |
| Galerie          | SSG + ISR     | Contenu dynamique admin, revalidate: 60s     |
| Activité 2 / 3   | SSG           | Contenu statique / placeholder               |
| Réserver         | CSR           | Widget Planity JS côté client uniquement     |
| Admin (tout)     | CSR           | Pas de SEO nécessaire, protégé par auth      |

### Metadata Next.js

Chaque page publique doit exporter un objet `metadata` ou une fonction `generateMetadata` :

```typescript
// app/prestations/page.tsx
export const metadata: Metadata = {
  title: 'Prestations | KPIL R Men — Prothésiste capillaire',
  description: 'Découvrez nos transformations capillaires : prothèses, compléments, entretien. Résultats naturels garantis.',
  openGraph: {
    title: 'Prestations | KPIL R Men',
    description: 'Transformations capillaires sur mesure',
    images: ['/assets/og-prestations.jpg'],
  },
};
```

### SEO technique

- `next/image` pour toutes les images (lazy loading, formats modernes, srcset automatique)
- Sitemap auto via `app/sitemap.ts`
- `robots.txt` via `app/robots.ts`
- Balises `<h1>` uniques par page
- Données structurées JSON-LD pour le business local (LocalBusiness schema)
- Canonical URLs sur chaque page
- Pages admin exclues du sitemap et du robots.txt (`noindex, nofollow`)

### JSON-LD — Données structurées

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "KPIL R Men",
  "description": "Prothésiste capillaire spécialisé",
  "image": "https://...",
  "address": { "@type": "PostalAddress", "..." },
  "telephone": "...",
  "url": "https://...",
  "priceRange": "€€"
}
```

---

## Espace Admin (`/admin`)

### Accès

- Route protégée par auth JWT
- Rôle unique : `admin`
- Login via email + mot de passe
- JWT access token (15 min) + refresh token (7 jours)
- Pas d'inscription publique — le compte admin est seedé en base

### Fonctionnalités admin

#### Gestion galerie avant/après

- **Lister** toutes les entrées (grille + liste)
- **Ajouter** : upload 2 photos (avant + après) + titre + texte descriptif
- **Modifier** : changer photos, titre, texte
- **Supprimer** : soft delete ou hard delete
- **Réordonner** : drag & drop ou champ `position`
- Validation : formats acceptés (jpg, png, webp), taille max 5 Mo par image
- Redimensionnement automatique côté serveur (sharp ou similaire)

#### Gestion des prestations

- CRUD sur les prestations (titre, description, durée, prix)
- Activer/désactiver une prestation (visible ou non sur le site)

#### Dashboard (simple)

- Nombre de photos dans la galerie
- Nombre de prestations actives
- Dernière modification

---

## API — Endpoints

### Auth

```
POST   /api/auth/login          # { email, password } → { accessToken, refreshToken }
POST   /api/auth/refresh         # { refreshToken } → { accessToken }
POST   /api/auth/logout          # Invalider le refresh token
```

### Galerie (admin protégé)

```
GET    /api/gallery              # Liste publique (triée par position)
GET    /api/gallery/:id          # Détail d'une entrée
POST   /api/admin/gallery        # Créer { beforeImage, afterImage, title, description } (URLs Firebase)
PUT    /api/admin/gallery/:id    # Modifier
DELETE /api/admin/gallery/:id    # Supprimer
PATCH  /api/admin/gallery/order  # Réordonner { items: [{ id, position }] }
```

### Prestations (admin protégé pour écriture)

```
GET    /api/services             # Liste publique (actives uniquement)
GET    /api/services/:id         # Détail
POST   /api/admin/services       # Créer
PUT    /api/admin/services/:id   # Modifier
DELETE /api/admin/services/:id   # Supprimer
```

### Upload (Firebase Storage — signed URL)

```
POST   /api/admin/upload/signed-url   # { filename, contentType } → { signedUrl, publicUrl }
```

#### Flow d'upload

1. L'admin sélectionne une image dans le dashboard
2. Le front appelle `POST /api/admin/upload/signed-url` (route protégée JWT)
3. NestJS génère un signed URL via Firebase Admin SDK (expiration 15 min)
4. Le front upload directement vers Firebase Storage via PUT sur le signed URL
5. Une fois l'upload terminé, le front utilise le `publicUrl` retourné pour sauvegarder en base

#### Firebase Storage — config

- Bucket : `kpil-r-men.firebasestorage.app` (ou custom)
- Dossier images : `gallery/{uuid}-{filename}`
- Règles de sécurité : lecture publique, écriture via signed URL uniquement
- Formats acceptés : jpg, png, webp
- Taille max : 5 Mo par image

#### Côté NestJS — Firebase Admin SDK

```typescript
import { initializeApp, cert } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';

initializeApp({
  credential: cert('./firebase-service-account.json'),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});

// Génération signed URL
const bucket = getStorage().bucket();
const file = bucket.file(`gallery/${uuid}-${filename}`);
const [signedUrl] = await file.getSignedUrl({
  version: 'v4',
  action: 'write',
  expires: Date.now() + 15 * 60 * 1000,
  contentType,
});
```

---

## Base de données — Schéma

### Table `admins`

```sql
CREATE TABLE admins (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email       VARCHAR(255) UNIQUE NOT NULL,
  password    VARCHAR(255) NOT NULL,  -- bcrypt hash
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);
```

### Table `gallery_items`

```sql
CREATE TABLE gallery_items (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title           VARCHAR(255) NOT NULL,
  description     TEXT,
  before_image    VARCHAR(500) NOT NULL,  -- URL publique Firebase Storage
  after_image     VARCHAR(500) NOT NULL,  -- URL publique Firebase Storage
  position        INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### Table `services`

```sql
CREATE TABLE services (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       VARCHAR(255) NOT NULL,
  description TEXT,
  duration    VARCHAR(50),              -- ex: "2h40"
  price       DECIMAL(10, 2),
  is_active   BOOLEAN DEFAULT true,
  position    INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);
```

### Table `refresh_tokens`

```sql
CREATE TABLE refresh_tokens (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id    UUID REFERENCES admins(id) ON DELETE CASCADE,
  token       VARCHAR(500) NOT NULL,
  expires_at  TIMESTAMPTZ NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
```

### Migration seed

```sql
-- Seed admin (mot de passe à changer en prod)
INSERT INTO admins (email, password) VALUES (
  'admin@kpilrmen.fr',
  '$2b$10$...'  -- bcrypt hash de 'changeme'
);
```

---

## V2 — Fonctionnalités futures (NE PAS implémenter en V1)

Ces fonctionnalités sont documentées pour contexte mais ne doivent PAS être codées maintenant.

- **Espace client** : login client JWT, profil, dashboard perso
- **Historique RDV** : sync avec Planity si API disponible, sinon saisie admin
- **Messagerie client ↔ prothésiste** : WebSocket ou polling, notifications
- **2FA TOTP** sur le login admin

---

## Conventions de code

### Général

- TypeScript strict partout (`strict: true`, `noUncheckedIndexedAccess: true`)
- ESLint + Prettier configurés à la racine
- **ZÉRO `any`, `unknown`, `as`, `!`, `@ts-ignore`, `@ts-expect-error`** — tolérance zéro
- Imports absolus via path aliases (`@/components`, `@/queries`, `@/stores`)
- Voir `skills/project-conventions/SKILL.md` pour les règles détaillées et exemples

### Frontend (Next.js App Router)

- Composants fonctionnels uniquement (pas de classes)
- Un composant par fichier
- Nommage : `PascalCase.tsx` pour les composants, `camelCase.ts` pour les utils
- Par défaut tout est Server Component — ajouter `'use client'` uniquement quand nécessaire
- `next/image` obligatoire pour toutes les images (pas de `<img>` brut)
- `next/link` pour toute navigation interne (pas de `<a>` brut)
- **Data fetching pages publiques** : `fetch()` dans les Server Components avec `revalidate` pour ISR
- **Data fetching pages admin** : TanStack React Query v5 exclusivement — hooks dans `/queries/`
- **State management** : Zustand — stores dans `/stores/`, un store par domaine
- **API calls** : client HTTP typé dans `lib/api-client.ts` — JAMAIS de fetch/axios brut dans un composant
- JAMAIS de `useEffect` + `fetch` + `useState` pour du data fetching

### Backend

- Architecture NestJS standard : module → controller → service
- Validation des inputs via Zod (DTOs du package shared)
- Gestion d'erreurs centralisée (exception filters NestJS)
- Pas de Prisma, pas de TypeORM — raw SQL via postgres.js
- Variables d'environnement via `@nestjs/config` + `.env`

### Shared

- Tous les DTOs sont des schémas Zod exportés depuis `@kpil/shared`
- Les types TypeScript sont inférés des schémas Zod (`z.infer<typeof schema>`)
- Constantes partagées (rôles, limites upload, etc.)

---

## Variables d'environnement

```env
# API
DATABASE_URL=postgresql://user:pass@localhost:5432/kpilrmen
JWT_SECRET=your-secret-key-min-32-chars
JWT_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d
PORT=3001

# Firebase Storage
FIREBASE_STORAGE_BUCKET=kpil-r-men.firebasestorage.app
FIREBASE_SERVICE_ACCOUNT=./firebase-service-account.json
UPLOAD_MAX_SIZE=5242880

# Web
VITE_API_URL=http://localhost:3001/api
VITE_PLANITY_KEY=your-planity-api-key
VITE_PLANITY_COLOR=#BB7348
```

> **Note** : Le fichier `firebase-service-account.json` est gitignored. Générer la clé depuis Firebase Console → Project Settings → Service Accounts.

---

## Commandes

```bash
# Install
pnpm install

# Dev
pnpm --filter web dev          # Frontend sur :3000
pnpm --filter api dev          # Backend sur :3001

# Build
pnpm --filter shared build
pnpm --filter web build
pnpm --filter api build

# Migrations
pnpm --filter api migrate      # Exécuter les migrations SQL
pnpm --filter api seed         # Seed de données initiales
```

---

## Skills de référence

Les fichiers suivants contiennent des conventions détaillées que Claude Code doit consulter :

| Skill | Fichier | Contenu |
|-------|---------|---------|
| Conventions projet | `skills/project-conventions/SKILL.md` | Règles archi non-négociables (raw SQL, Server Components, auth, nommage) |
| SEO patterns | `skills/seo-patterns/SKILL.md` | Checklist SEO par page, metadata, JSON-LD, sitemap, next/image |
| Firebase upload | `skills/firebase-upload-flow/SKILL.md` | Flow complet signed URL, code backend/frontend, hook, validation |
