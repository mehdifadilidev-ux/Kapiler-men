import { z } from 'zod';

export const createGallerySchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  beforeImage: z.string().url(),
  afterImage: z.string().url(),
});

export type CreateGalleryDto = z.infer<typeof createGallerySchema>;

export const updateGallerySchema = createGallerySchema.partial();

export type UpdateGalleryDto = z.infer<typeof updateGallerySchema>;

export const galleryItemSchema = createGallerySchema.extend({
  id: z.string().uuid(),
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
