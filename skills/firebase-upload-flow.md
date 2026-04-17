# SKILL — Firebase Storage Upload Flow (KPIL R Men)

## Objectif

Ce skill décrit le flow exact d'upload d'images via Firebase Storage avec signed URLs.

---

## Architecture du flow

```
Admin (browser)                    NestJS API                     Firebase Storage
     |                                |                                |
     |  1. POST /admin/upload/signed-url                               |
     |  { filename, contentType }     |                                |
     |------------------------------->|                                |
     |                                |  2. getSignedUrl(v4, write)    |
     |                                |------------------------------->|
     |  4. { signedUrl, publicUrl }   |                                |
     |<-------------------------------|                                |
     |                                                                 |
     |  5. PUT signedUrl (binary)                                      |
     |---------------------------------------------------------------->|
     |  6. 200 OK                                                      |
     |<----------------------------------------------------------------|
     |                                                                 |
     |  7. POST /admin/gallery                                         |
     |  { title, categoryId, type, beforeImage: publicUrl, ... }       |
     |------------------------------->|                                |
```

---

## Backend — Upload Service

```typescript
@Injectable()
export class UploadService {
  private bucket = getStorage().bucket();

  async generateSignedUrl(filename: string, contentType: string) {
    const ext = filename.split('.').pop();
    const filePath = `gallery/${uuid()}.${ext}`;
    const file = this.bucket.file(filePath);

    const [signedUrl] = await file.getSignedUrl({
      version: 'v4',
      action: 'write',
      expires: Date.now() + 15 * 60 * 1000,
      contentType,
    });

    const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${this.bucket.name}/o/${encodeURIComponent(filePath)}?alt=media`;
    return { signedUrl, publicUrl, filePath };
  }

  async deleteFile(filePath: string) {
    try {
      await this.bucket.file(filePath).delete();
    } catch (error) {
      console.warn(`Failed to delete file ${filePath}:`, error);
    }
  }
}
```

---

## Shared — DTO Zod

```typescript
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;

export const signedUrlRequestSchema = z.object({
  filename: z.string().min(1).max(255),
  contentType: z.enum(ALLOWED_TYPES, {
    errorMap: () => ({ message: 'Format accepté : JPG, PNG, WebP' }),
  }),
});
```

---

## Validation côté front

```typescript
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024;

export function validateImage(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) return 'Format non supporté. Utilisez JPG, PNG ou WebP.';
  if (file.size > MAX_SIZE) return 'Le fichier dépasse la taille maximale de 5 Mo.';
  return null;
}
```

---

## Variables d'environnement requises

```env
# Backend
FIREBASE_STORAGE_BUCKET=kpil-r-men.firebasestorage.app
FIREBASE_SERVICE_ACCOUNT=./firebase-service-account.json

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```
