# SKILL — Project Conventions (KPIL R Men)

## Objectif

Ce skill définit les conventions architecturales non-négociables du projet. Claude Code doit les respecter systématiquement sans jamais proposer d'alternatives.

---

## Règles absolues

### Base de données

- **Raw SQL uniquement** via `postgres.js` — JAMAIS de Prisma, TypeORM, Drizzle, Knex ou tout autre ORM/query builder
- Migrations en fichiers `.sql` versionnés manuellement (`001_init.sql`, `002_add_gallery.sql`, etc.)
- Utiliser `gen_random_uuid()` pour les IDs (UUID v4 natif PostgreSQL)
- Toujours typer les résultats de requêtes avec des interfaces TypeScript

### Backend NestJS

- Architecture stricte : Module → Controller → Service
- Un module par domaine métier (`auth`, `gallery`, `services`, `upload`, `news-banner`)
- Validation des inputs via Zod (DTOs importés depuis `@kpil/shared`)
- Guards NestJS pour la protection des routes admin
- Exception filters centralisés pour la gestion d'erreurs
- Variables d'environnement via `@nestjs/config` + `.env`
- Ne JAMAIS utiliser Express directement — passer par les abstractions NestJS

### Frontend Next.js

- **Server Components par défaut** — ne pas ajouter `'use client'` sauf si nécessaire
- `next/image` obligatoire — JAMAIS de `<img>` brut
- `next/link` obligatoire — JAMAIS de `<a href>` pour la navigation interne
- Pages admin : toutes en `'use client'`

### Data Fetching — React Query (TanStack Query v5)

- **Pages admin (CSR)** : React Query exclusivement
- Tous les hooks query dans `/queries/` — un fichier par domaine
- Clés de cache centralisées dans `queryKeys.ts`
- Mutations avec `onSuccess` → `invalidateQueries`
- JAMAIS de `fetch` / `axios` brut dans un composant

### State Management — Zustand

- Un store par domaine : `useAuthStore`, `useUIStore`
- JAMAIS de React Context pour l'état global

### Package shared (`@kpil/shared`)

- Tous les DTOs sont des schémas Zod
- Types TypeScript inférés via `z.infer<typeof schema>`
- Ne JAMAIS dupliquer un type entre front et back

### Styling

- Tailwind CSS uniquement — pas de CSS modules, styled-components, ou CSS-in-JS

### Auth

- JWT HS256 avec access token (15 min) + refresh token (7 jours) en httpOnly cookie
- Ne JAMAIS utiliser NextAuth, Auth0, Clerk

### Nommage

- Fichiers composants : `PascalCase.tsx`
- Fichiers utils/hooks/services : `camelCase.ts`
- Dossiers : `kebab-case`
- Types/interfaces : `PascalCase`
- Tables/colonnes SQL : `snake_case`

---

## Typage strict — Tolérance zéro

**ZÉRO `any`, `unknown`, `as`, `!`, `// @ts-ignore`, `// @ts-expect-error`**

| Situation | ❌ Mauvais | ✅ Bon |
|-----------|-----------|--------|
| API response | `res.json() as T` | `schema.parse(await res.json())` |
| Event handler | `(e: any) => ...` | `(e: React.ChangeEvent<HTMLInputElement>) => ...` |
| Ref | `useRef(null)!` | `useRef<HTMLDivElement>(null)` + guard |
| Catch block | `catch (e: any)` | `catch (e) { if (e instanceof Error) ... }` |
| postgres.js | `rows as T[]` | `sql<T[]>\`query\`` |
