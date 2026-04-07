import { useAuthStore } from '@/stores/useAuthStore';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export class ApiRequestError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiRequestError';
  }
}

async function parseJson<T>(response: Response): Promise<T> {
  // res.json() returns Promise<any> by Web API design.
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return response.json();
}

function decodeAdminFromToken(token: string): { id: string; email: string } | null {
  try {
    const parts = token.split('.');
    const payload = parts[1];
    if (!payload) return null;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const decoded: { sub?: string; email?: string } = JSON.parse(atob(payload));
    if (!decoded.sub || !decoded.email) return null;
    return { id: decoded.sub, email: decoded.email };
  } catch {
    return null;
  }
}

let refreshPromise: Promise<boolean> | null = null;

async function tryRefreshToken(): Promise<boolean> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const res = await fetch(`${BASE_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!res.ok) return false;

      const data = await parseJson<{ accessToken: string }>(res);
      const admin = decodeAdminFromToken(data.accessToken);
      if (!admin) return false;

      useAuthStore.getState().setAuth(data.accessToken, admin);
      return true;
    } catch {
      return false;
    }
  })();

  try {
    return await refreshPromise;
  } finally {
    refreshPromise = null;
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}, isRetry = false): Promise<T> {
  const token = useAuthStore.getState().accessToken;

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (res.status === 401 && !isRetry) {
    const refreshed = await tryRefreshToken();
    if (refreshed) {
      return request<T>(endpoint, options, true);
    }
    useAuthStore.getState().clearAuth();
    window.location.href = '/admin/login';
  }

  if (!res.ok) {
    const body = await parseJson<{ message: string }>(res);
    throw new ApiRequestError(res.status, body.message);
  }

  return parseJson<T>(res);
}

export const apiClient = {
  get: <T>(endpoint: string) => request<T>(endpoint),
  post: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  delete: <T>(endpoint: string) => request<T>(endpoint, { method: 'DELETE' }),
};
