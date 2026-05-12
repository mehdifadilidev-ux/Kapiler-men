import { z } from 'zod';

export const createPartnerBrandSchema = z.object({
  name: z.string().min(1).max(100),
  logo: z.string().url(),
  website: z.string().url().optional(),
});

export type CreatePartnerBrandDto = z.infer<typeof createPartnerBrandSchema>;

export const updatePartnerBrandSchema = createPartnerBrandSchema.partial();

export type UpdatePartnerBrandDto = z.infer<typeof updatePartnerBrandSchema>;

export const reorderPartnerBrandsSchema = z.object({
  ids: z.array(z.string().uuid()),
});

export type ReorderPartnerBrandsDto = z.infer<typeof reorderPartnerBrandsSchema>;

export const partnerBrandSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  logo: z.string().url(),
  website: z.string().url().nullable(),
  position: z.number().int(),
  isVisible: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type PartnerBrand = z.infer<typeof partnerBrandSchema>;
