export const queryKeys = {
  gallery: {
    all: ['gallery'] as const,
    detail: (id: string) => ['gallery', id] as const,
  },
  services: {
    all: ['services'] as const,
    detail: (id: string) => ['services', id] as const,
  },
} as const;
