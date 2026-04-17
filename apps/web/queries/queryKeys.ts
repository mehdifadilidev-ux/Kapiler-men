export const queryKeys = {
  gallery: {
    all: ['gallery'] as const,
    detail: (id: string) => ['gallery', id] as const,
  },
  galleryCategories: {
    all: ['gallery-categories'] as const,
  },
  newsBanner: {
    all: ['news-banner'] as const,
    active: ['news-banner', 'active'] as const,
  },
  services: {
    all: ['services'] as const,
    detail: (id: string) => ['services', id] as const,
  },
  testimonials: {
    all: ['testimonials'] as const,
  },
} as const;
