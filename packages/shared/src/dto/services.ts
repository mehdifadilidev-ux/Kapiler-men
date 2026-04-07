import { z } from 'zod';

export const createServiceSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  image: z.string().url().optional(),
  features: z.array(z.string().min(1)).optional(),
  duration: z.string().max(50).optional(),
  price: z.number().positive().optional(),
  isActive: z.boolean().optional(),
});

export type CreateServiceDto = z.infer<typeof createServiceSchema>;

export const updateServiceSchema = createServiceSchema.partial();

export type UpdateServiceDto = z.infer<typeof updateServiceSchema>;

export const serviceSchema = createServiceSchema.extend({
  id: z.string().uuid(),
  image: z.string().url().nullable(),
  features: z.array(z.string()),
  isActive: z.boolean(),
  position: z.number().int(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Service = z.infer<typeof serviceSchema>;
