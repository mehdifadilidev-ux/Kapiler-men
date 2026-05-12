import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { queryKeys } from './queryKeys';
import type {
  PartnerBrand,
  CreatePartnerBrandDto,
  UpdatePartnerBrandDto,
  ReorderPartnerBrandsDto,
} from '@kpil/shared';

export function usePartnerBrands() {
  return useQuery({
    queryKey: queryKeys.partnerBrands.all,
    queryFn: () => apiClient.get<PartnerBrand[]>('/admin/partner-brands'),
  });
}

export function useCreatePartnerBrand() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreatePartnerBrandDto) =>
      apiClient.post<PartnerBrand>('/admin/partner-brands', dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.partnerBrands.all });
    },
  });
}

export function useUpdatePartnerBrand() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdatePartnerBrandDto }) =>
      apiClient.put<PartnerBrand>(`/admin/partner-brands/${id}`, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.partnerBrands.all });
    },
  });
}

export function useDeletePartnerBrand() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/admin/partner-brands/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.partnerBrands.all });
    },
  });
}

export function useTogglePartnerBrandVisibility() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiClient.patch<PartnerBrand>(`/admin/partner-brands/${id}/visibility`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.partnerBrands.all });
    },
  });
}

export function useReorderPartnerBrands() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: ReorderPartnerBrandsDto) =>
      apiClient.patch('/admin/partner-brands/order', dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.partnerBrands.all });
    },
  });
}
