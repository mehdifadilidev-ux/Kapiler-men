/**
 * Typed fetch helper for Server Components (SSR/ISR).
 * Centralizes the res.json() → T pattern to avoid `as` assertions in pages.
 */
export async function fetchApi<T>(
  path: string,
  options?: { revalidate?: number },
): Promise<T | null> {
  try {
    const res = await fetch(`${process.env.API_URL}${path}`, {
      next: { revalidate: options?.revalidate ?? 60 },
    });

    if (!res.ok) return null;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return res.json();
  } catch {
    return null;
  }
}
