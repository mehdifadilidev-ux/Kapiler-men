import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { queryKeys } from './queryKeys';
import type { GalleryItem, CreateGalleryDto, UpdateGalleryDto, ReorderGalleryDto } from '@kpil/shared';

export function useGalleryItems() {
  return useQuery({
    queryKey: queryKeys.gallery.all,
    queryFn: () => apiClient.get<GalleryItem[]>('/gallery'),
  });
}

export function useGalleryItem(id: string) {
  return useQuery({
    queryKey: queryKeys.gallery.detail(id),
    queryFn: () => apiClient.get<GalleryItem>(`/gallery/${id}`),
    enabled: !!id,
  });
}

export function useCreateGalleryItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateGalleryDto) => apiClient.post<GalleryItem>('/admin/gallery', dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.gallery.all });
    },
  });
}

export function useUpdateGalleryItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateGalleryDto }) =>
      apiClient.put<GalleryItem>(`/admin/gallery/${id}`, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.gallery.all });
    },
  });
}

export function useDeleteGalleryItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/admin/gallery/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.gallery.all });
    },
  });
}

export function useReorderGallery() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: ReorderGalleryDto) => apiClient.post('/admin/gallery/order', dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.gallery.all });
    },
  });
}
