import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/stores/useAuthStore';
import type { LoginDto, AdminProfile } from '@kpil/shared';

function decodeAdminFromToken(token: string): AdminProfile {
  const parts = token.split('.');
  const payload = parts[1] ?? '';
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const decoded: { sub: string; email: string } = JSON.parse(atob(payload));
  return { id: decoded.sub, email: decoded.email };
}

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: (dto: LoginDto) => apiClient.post<{ accessToken: string }>('/auth/login', dto),
    onSuccess: (data) => {
      const admin = decodeAdminFromToken(data.accessToken);
      setAuth(data.accessToken, admin);
    },
  });
}

export function useLogout() {
  const clearAuth = useAuthStore((s) => s.clearAuth);

  return useMutation({
    mutationFn: () => apiClient.post('/auth/logout', {}),
    onSettled: () => {
      clearAuth();
    },
  });
}
