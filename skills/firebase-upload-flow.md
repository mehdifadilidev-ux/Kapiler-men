# SKILL — Firebase Storage Upload Flow (KPIL R Men)

## Objectif

Ce skill décrit le flow exact d'upload d'images via Firebase Storage avec signed URLs. Claude Code doit suivre ce flow précisément sans improviser d'alternative.

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
     |                                |  3. { signedUrl, expiry }      |
     |                                |<-------------------------------|
     |  4. { signedUrl, publicUrl }   |                                |
     |<-------------------------------|                                |
     |                                                                 |
     |  5. PUT signedUrl (binary)                                      |
     |---------------------------------------------------------------->|
     |  6. 200 OK                                                      |
     |<----------------------------------------------------------------|
     |                                                                 |
     |  7. POST /admin/gallery                                         |
     |  { title, description, beforeImage: publicUrl, ... }            |
     |------------------------------->|                                |
     |                                |  8. INSERT INTO gallery_items  |
     |                                |                                |
```

---

## Backend — NestJS Upload Module

### Service

```typescript
// apps/api/src/upload/upload.service.ts
import { Injectable } from '@nestjs/common';
import { getStorage } from 'firebase-admin/storage';
import { v4 as uuid } from 'uuid';

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
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
      contentType,
    });

    const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${this.bucket.name}/o/${encodeURIComponent(filePath)}?alt=media`;

    return { signedUrl, publicUrl, filePath };
  }

  async deleteFile(filePath: string) {
    try {
      await this.bucket.file(filePath).delete();
    } catch (error) {
      // Log mais ne pas throw — le fichier peut déjà être supprimé
      console.warn(`Failed to delete file ${filePath}:`, error);
    }
  }
}
```

### Controller

```typescript
// apps/api/src/upload/upload.controller.ts
import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UploadService } from './upload.service';
import { signedUrlRequestSchema } from '@kpil/shared';

@Controller('admin/upload')
@UseGuards(JwtAuthGuard)
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Post('signed-url')
  async getSignedUrl(@Body() body: unknown) {
    const { filename, contentType } = signedUrlRequestSchema.parse(body);
    return this.uploadService.generateSignedUrl(filename, contentType);
  }
}
```

### Firebase Init — Module racine

```typescript
// apps/api/src/app.module.ts
import { initializeApp, cert } from 'firebase-admin/app';

// Initialiser une seule fois au démarrage
initializeApp({
  credential: cert(process.env.FIREBASE_SERVICE_ACCOUNT),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});
```

---

## Frontend — Hook d'upload

```typescript
// apps/web/hooks/useFirebaseUpload.ts
'use client';

import { useState } from 'react';

interface UploadResult {
  publicUrl: string;
  filePath: string;
}

export function useFirebaseUpload() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const upload = async (file: File): Promise<UploadResult> => {
    setUploading(true);
    setError(null);
    setProgress(0);

    try {
      // 1. Demander le signed URL au backend
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/upload/signed-url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAccessToken()}`,
        },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
        }),
      });

      if (!res.ok) throw new Error('Failed to get signed URL');
      const { signedUrl, publicUrl, filePath } = await res.json();

      // 2. Upload directement vers Firebase Storage
      const uploadRes = await fetch(signedUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      });

      if (!uploadRes.ok) throw new Error('Upload failed');

      setProgress(100);
      return { publicUrl, filePath };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Upload error';
      setError(message);
      throw err;
    } finally {
      setUploading(false);
    }
  };

  return { upload, uploading, progress, error };
}
```

---

## Shared — DTO Zod

```typescript
// packages/shared/src/dto/upload.ts
import { z } from 'zod';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;
const MAX_SIZE_LABEL = '5 Mo';

export const signedUrlRequestSchema = z.object({
  filename: z.string().min(1).max(255),
  contentType: z.enum(ALLOWED_TYPES, {
    errorMap: () => ({ message: `Format accepté : JPG, PNG, WebP` }),
  }),
});

export type SignedUrlRequest = z.infer<typeof signedUrlRequestSchema>;
```

---

## Validation côté front (avant upload)

```typescript
// apps/web/lib/validateImage.ts
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024; // 5 Mo

export function validateImage(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'Format non supporté. Utilisez JPG, PNG ou WebP.';
  }
  if (file.size > MAX_SIZE) {
    return 'Le fichier dépasse la taille maximale de 5 Mo.';
  }
  return null; // Valide
}
```

---

## Next.js — Config images distantes

```javascript
// apps/web/next.config.js
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '/v0/b/**',
      },
    ],
  },
};
```

---

## Suppression d'image

Quand une entrée galerie est supprimée ou qu'une image est remplacée, le backend doit aussi supprimer le fichier dans Firebase Storage :

```typescript
// Dans gallery.service.ts
async deleteGalleryItem(id: string) {
  const [item] = await this.sql<GalleryItem[]>`
    SELECT before_image, after_image FROM gallery_items WHERE id = ${id}
  `;

  if (!item) throw new NotFoundException();

  // Supprimer les fichiers Firebase
  await this.uploadService.deleteFile(extractFilePath(item.before_image));
  await this.uploadService.deleteFile(extractFilePath(item.after_image));

  // Supprimer en base
  await this.sql`DELETE FROM gallery_items WHERE id = ${id}`;
}
```

---

## Règles Firebase Storage

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /gallery/{fileName} {
      // Lecture publique (les images sont affichées sur le site)
      allow read: if true;
      // Écriture uniquement via signed URL (géré côté serveur)
      allow write: if false;
    }
  }
}
```

> Les signed URLs contournent les règles de sécurité Firebase — c'est le comportement attendu. Les règles ci-dessus empêchent uniquement l'écriture directe non-signée.

---

## Variables d'environnement requises

```env
# Backend (apps/api/.env)
FIREBASE_STORAGE_BUCKET=kpil-r-men.firebasestorage.app
FIREBASE_SERVICE_ACCOUNT=./firebase-service-account.json

# Frontend (apps/web/.env.local)
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

> Le fichier `firebase-service-account.json` est **gitignored**. Ne JAMAIS le commiter.
