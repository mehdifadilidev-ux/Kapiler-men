import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { queryKeys } from './queryKeys';
import type {
  GalleryCategory,
  CreateGalleryCategoryDto,
  UpdateGalleryCategoryDto,
} from '@kpil/shared';

export function useGalleryCategories() {
  return useQuery({
    queryKey: queryKeys.galleryCategories.all,
    queryFn: () => apiClient.get<GalleryCategory[]>('/gallery/categories'),
  });
}

export function useCreateGalleryCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateGalleryCategoryDto) =>
      apiClient.post<GalleryCategory>('/admin/gallery/categories', dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.galleryCategories.all });
    },
  });
}

export function useUpdateGalleryCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateGalleryCategoryDto }) =>
      apiClient.put<GalleryCategory>(`/admin/gallery/categories/${id}`, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.galleryCategories.all });
    },
  });
}

export function useDeleteGalleryCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/admin/gallery/categories/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.galleryCategories.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.gallery.all });
    },
  });
}
