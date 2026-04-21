import { z } from 'zod';

// Gallery item types
export const GALLERY_ITEM_TYPES = ['single', 'before_after'] as const;

export const createGallerySchema = z.object({
  categoryId: z.string().uuid().optional(),
  type: z.enum(GALLERY_ITEM_TYPES).default('before_after'),
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  beforeImage: z.string().url(),
  afterImage: z.string().url().optional(),
});

export type CreateGalleryDto = z.infer<typeof createGallerySchema>;

export const updateGallerySchema = createGallerySchema.partial();

export type UpdateGalleryDto = z.infer<typeof updateGallerySchema>;

export const galleryItemSchema = z.object({
  id: z.string().uuid(),
  categoryId: z.string().uuid().nullable(),
  type: z.enum(GALLERY_ITEM_TYPES),
  title: z.string(),
  description: z.string().nullable(),
  beforeImage: z.string(),
  afterImage: z.string().nullable(),
  position: z.number().int(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type GalleryItem = z.infer<typeof galleryItemSchema>;

export const reorderGallerySchema = z.object({
  items: z.array(
    z.object({
      id: z.string().uuid(),
      position: z.number().int().min(0),
    }),
  ),
});

export type ReorderGalleryDto = z.infer<typeof reorderGallerySchema>;
