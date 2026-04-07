import { z } from 'zod';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;

export const signedUrlRequestSchema = z.object({
  filename: z.string().min(1).max(255),
  contentType: z.enum(ALLOWED_TYPES, {
    errorMap: () => ({ message: 'Format accepté : JPG, PNG, WebP' }),
  }),
});

export type SignedUrlRequest = z.infer<typeof signedUrlRequestSchema>;

export const signedUrlResponseSchema = z.object({
  signedUrl: z.string().url(),
  publicUrl: z.string().url(),
  filePath: z.string(),
});

export type SignedUrlResponse = z.infer<typeof signedUrlResponseSchema>;

export const UPLOAD_MAX_SIZE = 5 * 1024 * 1024; // 5 Mo
export const ALLOWED_IMAGE_TYPES = ALLOWED_TYPES;
