import { z } from 'zod';

export const createServiceSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  image: z.string().url().optional(),
  imageAlt: z.string().max(255).optional(),
  imageTitle: z.string().max(255).optional(),
  features: z.array(z.string().min(1)).optional(),
  duration: z.string().max(50).optional(),
  price: z.number().positive().optional(),
  section: z.string().max(255).optional(),
  isActive: z.boolean().optional(),
});

export type CreateServiceDto = z.infer<typeof createServiceSchema>;

export const updateServiceSchema = createServiceSchema.partial();

export type UpdateServiceDto = z.infer<typeof updateServiceSchema>;

const responsePrice = z.preprocess(
  (val) => {
    if (val === null || val === undefined || val === '') return null;
    if (typeof val === 'string') {
      const parsed = parseFloat(val);
      return Number.isFinite(parsed) ? parsed : null;
    }
    return val;
  },
  z.number().positive().nullable(),
);

export const serviceSchema = createServiceSchema.extend({
  id: z.string().uuid(),
  description: z.string().nullable().optional(),
  duration: z.string().nullable().optional(),
  image: z.string().url().nullable(),
  imageAlt: z.string().nullable().optional(),
  imageTitle: z.string().nullable().optional(),
  features: z.array(z.string()),
  price: responsePrice,
  section: z.string().nullable(),
  isActive: z.boolean(),
  position: z.number().int(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Service = z.infer<typeof serviceSchema>;
