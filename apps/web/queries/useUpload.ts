import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { SignedUrlResponse } from '@kpil/shared';

interface UploadResult {
  publicUrl: string;
  filePath: string;
}

export function useUploadImage() {
  return useMutation({
    mutationFn: async (file: File): Promise<UploadResult> => {
      // 1. Get signed URL from backend
      const { signedUrl, publicUrl, filePath } = await apiClient.post<SignedUrlResponse>(
        '/admin/upload/signed-url',
        { filename: file.name, contentType: file.type },
      );

      // 2. Upload directly to Firebase Storage
      const uploadRes = await fetch(signedUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      });

      if (!uploadRes.ok) {
        throw new Error('Upload failed');
      }

      return { publicUrl, filePath };
    },
  });
}
