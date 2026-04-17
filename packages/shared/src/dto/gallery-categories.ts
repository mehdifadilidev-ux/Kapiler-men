import { z } from 'zod';

export const createGalleryCategorySchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase with hyphens'),
});

export type CreateGalleryCategoryDto = z.infer<typeof createGalleryCategorySchema>;

export const updateGalleryCategorySchema = createGalleryCategorySchema.partial();

export type UpdateGalleryCategoryDto = z.infer<typeof updateGalleryCategorySchema>;

export const galleryCategorySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  position: z.number().int(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type GalleryCategory = z.infer<typeof galleryCategorySchema>;

export const reorderGalleryCategoriesSchema = z.object({
  items: z.array(
    z.object({
      id: z.string().uuid(),
      position: z.number().int().min(0),
    }),
  ),
});

export type ReorderGalleryCategoriesDto = z.infer<typeof reorderGalleryCategoriesSchema>;
