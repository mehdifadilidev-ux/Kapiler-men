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

```typescript
// ✅ CORRECT
import postgres from 'postgres';
const sql = postgres(process.env.DATABASE_URL);

const items = await sql<GalleryItem[]>`
  SELECT * FROM gallery_items WHERE id = ${id}
`;

// ❌ INTERDIT
import { PrismaClient } from '@prisma/client';
```

### Backend NestJS

- Architecture stricte : Module → Controller → Service
- Un module par domaine métier (`auth`, `gallery`, `services`, `upload`)
- Validation des inputs via Zod (DTOs importés depuis `@kpil/shared`)
- Guards NestJS pour la protection des routes admin
- Exception filters centralisés pour la gestion d'erreurs
- Variables d'environnement via `@nestjs/config` + `.env`
- Ne JAMAIS utiliser Express directement — passer par les abstractions NestJS

```typescript
// ✅ CORRECT — Guard JWT
@UseGuards(JwtAuthGuard)
@Post('gallery')
async create(@Body() dto: CreateGalleryDto) { ... }

// ❌ INTERDIT — middleware Express brut
app.use('/admin', (req, res, next) => { ... });
```

### Frontend Next.js

- **Server Components par défaut** — ne pas ajouter `'use client'` sauf si nécessaire
- Raisons valides pour `'use client'` : `useState`, `useEffect`, `useRef`, event handlers (`onClick`, `onChange`), browser APIs
- Raisons invalides : afficher des données, faire un fetch, layout statique
- `next/image` obligatoire — JAMAIS de `<img>` brut
- `next/link` obligatoire — JAMAIS de `<a href>` pour la navigation interne
- Pages admin : toutes en `'use client'` (pas de SEO nécessaire)
- Data fetching dans les Server Components via `fetch()` avec `revalidate`

```typescript
// ✅ CORRECT — Server Component pour les pages publiques (SSG/ISR)
export default async function PrestationsPage() {
  const services = await fetch(`${API_URL}/services`, {
    next: { revalidate: 60 },
  }).then(r => r.json()) as Service[];
  
  return <ServicesList services={services} />;
}

// ✅ CORRECT — React Query pour les pages admin (client-side)
'use client';
export default function AdminGalleryPage() {
  const { data, isLoading } = useGalleryItems();
  // ...
}

// ❌ INTERDIT — useEffect + fetch brut
useEffect(() => { fetch(...).then(...) }, []);

// ❌ INTERDIT — axios
import axios from 'axios';
```

### Data Fetching — React Query (TanStack Query v5)

- **Pages publiques (SSR/SSG)** : `fetch()` natif dans les Server Components avec `revalidate`
- **Pages admin (CSR)** : React Query exclusivement — JAMAIS de `useEffect` + `fetch` ou `useState` pour du data fetching
- Tous les hooks query dans `/queries/` — un fichier par domaine
- Clés de cache centralisées dans `queryKeys.ts`
- Mutations avec `onSuccess` → `invalidateQueries` pour garder le cache frais
- JAMAIS de `fetch` / `axios` brut dans un composant — toujours passer par un hook query

```typescript
// queries/queryKeys.ts
export const queryKeys = {
  gallery: {
    all: ['gallery'] as const,
    detail: (id: string) => ['gallery', id] as const,
  },
  services: {
    all: ['services'] as const,
    detail: (id: string) => ['services', id] as const,
  },
} as const;

// queries/useGallery.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { queryKeys } from './queryKeys';
import type { GalleryItem, CreateGalleryDto } from '@kpil/shared';

export function useGalleryItems() {
  return useQuery({
    queryKey: queryKeys.gallery.all,
    queryFn: () => apiClient.get<GalleryItem[]>('/admin/gallery'),
  });
}

export function useCreateGalleryItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateGalleryDto) => apiClient.post<GalleryItem>('/admin/gallery', dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.gallery.all });
    },
  });
}
```

### API Client typé

```typescript
// lib/api-client.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = useAuthStore.getState().accessToken;
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    // Gestion centralisée des erreurs typées
    const error: ApiError = await res.json();
    throw new ApiRequestError(res.status, error.message);
  }

  return res.json() as Promise<T>;
}

export const apiClient = {
  get: <T>(endpoint: string) => request<T>(endpoint),
  post: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  delete: <T>(endpoint: string) =>
    request<T>(endpoint, { method: 'DELETE' }),
};
```

### State Management — Zustand

- Un store par domaine : `useAuthStore`, `useUIStore`
- Stores dans `/stores/` — un fichier par store
- Typage strict des stores — interface pour le state + les actions
- Pas de logique métier dans les stores — juste de l'état
- JAMAIS de React Context pour l'état global — Zustand uniquement
- React Context uniquement pour les providers (QueryClientProvider, ThemeProvider)

```typescript
// stores/useAuthStore.ts
import { create } from 'zustand';

interface AuthState {
  accessToken: string | null;
  admin: AdminProfile | null;
  isAuthenticated: boolean;
}

interface AuthActions {
  setAuth: (token: string, admin: AdminProfile) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  accessToken: null,
  admin: null,
  isAuthenticated: false,
  setAuth: (accessToken, admin) => set({ accessToken, admin, isAuthenticated: true }),
  clearAuth: () => set({ accessToken: null, admin: null, isAuthenticated: false }),
}));
```

### Package shared (`@kpil/shared`)

- Tous les DTOs sont des schémas Zod
- Types TypeScript inférés via `z.infer<typeof schema>`
- Constantes partagées (rôles, limites, enums)
- Ne JAMAIS dupliquer un type entre front et back — toujours passer par shared
- Les types de réponse API sont aussi dans shared

```typescript
// packages/shared/src/dto/gallery.ts
import { z } from 'zod';

export const createGallerySchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  beforeImage: z.string().url(),
  afterImage: z.string().url(),
});

export type CreateGalleryDto = z.infer<typeof createGallerySchema>;

export const galleryItemSchema = createGallerySchema.extend({
  id: z.string().uuid(),
  position: z.number().int(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type GalleryItem = z.infer<typeof galleryItemSchema>;

// packages/shared/src/types/api.ts
export interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
}
```

### Styling

- Tailwind CSS uniquement — pas de CSS modules, styled-components, ou CSS-in-JS
- Utiliser les tokens de la charte graphique définis dans `tailwind.config.ts`
- Classes utilitaires Tailwind directement dans le JSX
- Composants UI réutilisables dans `components/ui/`

### Auth

- JWT HS256 avec access token (15 min) + refresh token (7 jours)
- Access token dans le header `Authorization: Bearer <token>` (géré par `apiClient`)
- État auth dans `useAuthStore` (Zustand)
- Refresh token géré via mutation React Query
- Refresh token stocké en httpOnly cookie ou localStorage (admin uniquement)
- Pas d'inscription publique — compte admin seedé en base
- Ne JAMAIS utiliser NextAuth, Auth0, Clerk ou tout autre provider d'auth externe

### Nommage

- Fichiers composants : `PascalCase.tsx`
- Fichiers utils/hooks/services : `camelCase.ts`
- Dossiers : `kebab-case`
- Variables/fonctions : `camelCase`
- Types/interfaces : `PascalCase`
- Constantes : `UPPER_SNAKE_CASE`
- Tables SQL : `snake_case`
- Colonnes SQL : `snake_case`

---

## Typage strict — Tolérance zéro

### Règle fondamentale

**ZÉRO `any`, `unknown`, `as`, `!`, `// @ts-ignore`, `// @ts-expect-error` dans tout le codebase.** Aucune exception, aucune excuse. Si Claude Code ne sait pas typer quelque chose, il doit trouver le bon type ou créer une interface — jamais contourner le compilateur.

### Config TypeScript

```json
// tsconfig.base.json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true,
    "exactOptionalPropertyTypes": true
  }
}
```

### Exemples

```typescript
// ✅ CORRECT — Type explicite
const items = await sql<GalleryItem[]>`SELECT * FROM gallery_items`;

// ✅ CORRECT — Narrowing au lieu de cast
function getItem(data: unknown): GalleryItem {
  return galleryItemSchema.parse(data);
}

// ✅ CORRECT — Guard type
function isGalleryItem(value: unknown): value is GalleryItem {
  return galleryItemSchema.safeParse(value).success;
}

// ✅ CORRECT — Generics typés
async function request<T>(endpoint: string): Promise<T> {
  const res = await fetch(endpoint);
  return res.json() as Promise<T>;
}

// ❌ INTERDIT — any
const data: any = await res.json();

// ❌ INTERDIT — unknown non-narrowé
function process(data: unknown) {
  return data.title;  // Error: Object is of type 'unknown'
}

// ❌ INTERDIT — Type assertion (as)
const item = data as GalleryItem;

// ❌ INTERDIT — Non-null assertion
const title = item!.title;

// ❌ INTERDIT — ts-ignore
// @ts-ignore
someUntypedFunction();

// ❌ INTERDIT — ts-expect-error
// @ts-expect-error
someUntypedFunction();
```

### Cas spéciaux — Comment résoudre sans tricher

| Situation | ❌ Mauvais | ✅ Bon |
|-----------|-----------|--------|
| API response | `res.json() as T` | `schema.parse(await res.json())` |
| Event handler | `(e: any) => ...` | `(e: React.ChangeEvent<HTMLInputElement>) => ...` |
| Ref | `useRef(null)!` | `useRef<HTMLDivElement>(null)` + guard `if (ref.current)` |
| Optional chaining | `obj!.prop` | `obj?.prop ?? fallback` |
| Catch block | `catch (e: any)` | `catch (e) { if (e instanceof Error) ... }` |
| JSON parse | `JSON.parse(str) as T` | `schema.parse(JSON.parse(str))` |
| Third-party lib | `// @ts-ignore` | Installer `@types/lib` ou déclarer module typé |
| postgres.js result | `rows as T[]` | `sql<T[]>\`query\`` (postgres.js supporte les generics) |

### ESLint — Règles de typage

```json
{
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unsafe-assignment": "error",
    "@typescript-eslint/no-unsafe-member-access": "error",
    "@typescript-eslint/no-unsafe-call": "error",
    "@typescript-eslint/no-unsafe-return": "error",
    "@typescript-eslint/no-non-null-assertion": "error",
    "@typescript-eslint/consistent-type-assertions": ["error", { "assertionStyle": "never" }]
  }
}
```
