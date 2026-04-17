import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { queryKeys } from './queryKeys';
import type { NewsBanner, CreateNewsBannerDto, UpdateNewsBannerDto } from '@kpil/shared';

export function useNewsBanners() {
  return useQuery({
    queryKey: queryKeys.newsBanner.all,
    queryFn: () => apiClient.get<NewsBanner[]>('/admin/news-banner'),
  });
}

export function useCreateNewsBanner() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateNewsBannerDto) =>
      apiClient.post<NewsBanner>('/admin/news-banner', dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.newsBanner.all });
    },
  });
}

export function useUpdateNewsBanner() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateNewsBannerDto }) =>
      apiClient.put<NewsBanner>(`/admin/news-banner/${id}`, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.newsBanner.all });
    },
  });
}

export function useDeleteNewsBanner() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/admin/news-banner/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.newsBanner.all });
    },
  });
}

export function useActivateNewsBanner() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiClient.patch<NewsBanner>(`/admin/news-banner/${id}/activate`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.newsBanner.all });
    },
  });
}
