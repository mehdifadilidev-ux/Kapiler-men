export const ROLES = {
  ADMIN: 'admin',
} as const;

export const JWT_EXPIRATION = '15m';
export const JWT_REFRESH_EXPIRATION = '7d';

export const UPLOAD_LIMITS = {
  MAX_SIZE: 5 * 1024 * 1024,
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
} as const;
