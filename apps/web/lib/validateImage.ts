const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024; // 5 Mo

export function validateImage(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'Format non supporte. Utilisez JPG, PNG ou WebP.';
  }
  if (file.size > MAX_SIZE) {
    return 'Le fichier depasse la taille maximale de 5 Mo.';
  }
  return null;
}
