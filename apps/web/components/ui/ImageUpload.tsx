'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { validateImage } from '@/lib/validateImage';
import { useUploadImage } from '@/queries/useUpload';

interface ImageUploadProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
}

export function ImageUpload({ label, value, onChange }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const upload = useUploadImage();
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validationError = validateImage(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    upload.mutate(file, {
      onSuccess: (result) => {
        onChange(result.publicUrl);
      },
      onError: () => {
        setError('Erreur lors de l\'upload. Verifiez votre connexion.');
      },
    });
  };

  return (
    <div>
      <p className="mb-2 text-sm font-medium">{label}</p>

      {value ? (
        <div className="relative">
          <Image
            src={value}
            alt={label}
            width={300}
            height={200}
            className="h-40 w-full rounded border border-bois-light object-cover"
          />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute right-2 top-2 rounded bg-black/60 px-2 py-1 text-xs text-white hover:bg-black/80"
          >
            Supprimer
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={upload.isPending}
          className="flex h-40 w-full items-center justify-center border-2 border-dashed border-bois-light text-sm text-gray transition-colors hover:border-bois hover:text-bois disabled:opacity-50"
        >
          {upload.isPending ? 'Upload en cours...' : 'Cliquez pour choisir une image'}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
