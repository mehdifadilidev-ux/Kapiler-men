import { z } from 'zod';

export const TESTIMONIAL_SOURCES = ['google', 'planity', 'other'] as const;

export const createTestimonialSchema = z.object({
  author: z.string().min(1).max(100),
  text: z.string().min(1).max(1000),
  rating: z.number().int().min(1).max(5),
  source: z.enum(TESTIMONIAL_SOURCES).default('google'),
});

export type CreateTestimonialDto = z.infer<typeof createTestimonialSchema>;

export const updateTestimonialSchema = createTestimonialSchema.partial();

export type UpdateTestimonialDto = z.infer<typeof updateTestimonialSchema>;

export const reorderTestimonialsSchema = z.object({
  ids: z.array(z.string().uuid()),
});

export type ReorderTestimonialsDto = z.infer<typeof reorderTestimonialsSchema>;

export const testimonialSchema = z.object({
  id: z.string().uuid(),
  author: z.string(),
  text: z.string(),
  rating: z.number().int().min(1).max(5),
  source: z.enum(TESTIMONIAL_SOURCES),
  position: z.number().int(),
  isVisible: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Testimonial = z.infer<typeof testimonialSchema>;
