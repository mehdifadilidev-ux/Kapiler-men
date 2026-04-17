# CLAUDE.md — KPIL'R Men

## Projet

Site web vitrine pour **KPIL'R Men**, un institut de prothèse capillaire pour homme situé à Orléans. Le site présente le concept, les soins, une galerie photo, des témoignages, et permet la prise de rendez-vous via Planity (widget embed). Un espace admin protégé permet au propriétaire de gérer le contenu dynamique (bannière actualités, galerie photos avec catégories, prestations).

**Positionnement éditorial** : premium, masculin, sobre, discret, confidentiel. L'institut accueille un seul client à la fois. Ambiance barber revisitée, tons blanc/noir/bois naturel.

**Tagline principale** : "Prothésiste capillaire"

**Accroches clés** :
- "Envie de prendre soin de vous ? Besoin de retrouver confiance en vous ?"
- "Un savoir-faire au service de votre image avec des solutions adaptées à chaque homme."
- "Espace privé entièrement dédié à l'homme et à son image."

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

## Design System — Charte graphique KPIL R Men

### Palette de couleurs

```
--color-white:     #FFFFFF
--color-black:     #000000
--color-gray:      #878787
--color-bois:      #BB7348
--color-bois-15:   rgba(187, 115, 72, 0.15)
```

### Typographie

| Usage             | Police        | Poids     |
|-------------------|---------------|-----------|
| Titres            | Montserrat    | SemiBold (600) |
| Texte courant     | Montserrat    | Medium (500) |
| Accent / signature| Bodoni Moda   | SemiBold Italic (600) |
| Lettrage espacé   | Montserrat Light | 300, letter-spacing: 0.5em |

---

## Pages & Navigation

### Navigation principale

```
Accueil | Présentation | Soins | Témoignages | Galerie | Contact    [CTA: Rendez-vous]
```

### Identité éditoriale

- Nom : **KPIL'R Men**
- Adresse : 64 Quai des Augustins — 45100 Orléans
- Téléphone : 06 66 97 25 62
- Email : kpilr-men@outlook.fr
- Instagram : https://www.instagram.com/kpilr_men/
- TikTok : https://www.tiktok.com/@kpilr_men

### Horaires

| Jour      | Horaires      |
|-----------|---------------|
| Lundi     | 9h30 – 19h00  |
| Mardi     | 9h30 – 16h00  |
| Mercredi  | Fermé         |
| Jeudi     | 9h30 – 19h00  |
| Vendredi  | 9h30 – 19h00  |
| Samedi    | 9h00 – 18h00  |
| Dimanche  | Fermé         |

---

## API — Endpoints

### Auth
```
POST   /api/auth/login
POST   /api/auth/refresh
POST   /api/auth/logout
```

### Bannière Actualités
```
GET    /api/news-banner
GET    /api/admin/news-banner
POST   /api/admin/news-banner
PUT    /api/admin/news-banner/:id
DELETE /api/admin/news-banner/:id
PATCH  /api/admin/news-banner/:id/activate
```

### Catégories galerie
```
GET    /api/gallery/categories
POST   /api/admin/gallery/categories
PUT    /api/admin/gallery/categories/:id
DELETE /api/admin/gallery/categories/:id
PATCH  /api/admin/gallery/categories/order
```

### Galerie — Photos
```
GET    /api/gallery              # ?category=slug optionnel
GET    /api/gallery/:id
POST   /api/admin/gallery
PUT    /api/admin/gallery/:id
DELETE /api/admin/gallery/:id
PATCH  /api/admin/gallery/order
```

### Prestations
```
GET    /api/services
GET    /api/services/:id
POST   /api/admin/services
PUT    /api/admin/services/:id
DELETE /api/admin/services/:id
```

### Upload
```
POST   /api/admin/upload/signed-url
```

---

## Commandes

```bash
pnpm install
pnpm --filter web dev          # :3000
pnpm --filter api dev          # :3001
pnpm --filter shared build
pnpm --filter web build
pnpm --filter api build
pnpm --filter api migrate
pnpm --filter api seed
```

---

## Skills de référence

| Skill | Fichier | Contenu |
|-------|---------|---------|
| Conventions projet | `skills/project-conventions.md` | Règles archi non-négociables |
| SEO patterns | `skills/seo-patterns.md` | Checklist SEO, metadata, JSON-LD |
| Firebase upload | `skills/firebase-upload-flow.md` | Flow signed URL complet |
