import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { queryKeys } from './queryKeys';
import type { Testimonial, CreateTestimonialDto, UpdateTestimonialDto, ReorderTestimonialsDto } from '@kpil/shared';

export function useTestimonials() {
  return useQuery({
    queryKey: queryKeys.testimonials.all,
    queryFn: () => apiClient.get<Testimonial[]>('/admin/testimonials'),
  });
}

export function useCreateTestimonial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateTestimonialDto) =>
      apiClient.post<Testimonial>('/admin/testimonials', dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.testimonials.all });
    },
  });
}

export function useUpdateTestimonial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateTestimonialDto }) =>
      apiClient.put<Testimonial>(`/admin/testimonials/${id}`, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.testimonials.all });
    },
  });
}

export function useDeleteTestimonial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/admin/testimonials/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.testimonials.all });
    },
  });
}

export function useToggleTestimonialVisibility() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiClient.patch<Testimonial>(`/admin/testimonials/${id}/visibility`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.testimonials.all });
    },
  });
}

export function useReorderTestimonials() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: ReorderTestimonialsDto) =>
      apiClient.patch('/admin/testimonials/order', dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.testimonials.all });
    },
  });
}
