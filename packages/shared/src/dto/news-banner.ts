import { z } from 'zod';

export const NEWS_BANNER_TYPES = ['info', 'promo', 'event'] as const;

export const createNewsBannerSchema = z.object({
  text: z.string().min(1).max(500),
  link: z.string().url().max(500).optional(),
  type: z.enum(NEWS_BANNER_TYPES).default('info'),
});

export type CreateNewsBannerDto = z.infer<typeof createNewsBannerSchema>;

export const updateNewsBannerSchema = createNewsBannerSchema.partial();

export type UpdateNewsBannerDto = z.infer<typeof updateNewsBannerSchema>;

export const newsBannerSchema = z.object({
  id: z.string().uuid(),
  text: z.string(),
  link: z.string().nullable(),
  type: z.enum(NEWS_BANNER_TYPES),
  isActive: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type NewsBanner = z.infer<typeof newsBannerSchema>;
