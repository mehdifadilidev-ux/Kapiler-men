'use client';

import { useState } from 'react';
import { ImageUpload } from '@/components/ui/ImageUpload';
import type { GalleryItem } from '@kpil/shared';

interface GalleryFormProps {
  item?: GalleryItem;
  onSubmit: (data: { title: string; description: string; beforeImage: string; afterImage: string }) => void;
  onCancel: () => void;
  isPending: boolean;
}

export function GalleryForm({ item, onSubmit, onCancel, isPending }: GalleryFormProps) {
  const [title, setTitle] = useState(item?.title ?? '');
  const [description, setDescription] = useState(item?.description ?? '');
  const [beforeImage, setBeforeImage] = useState(item?.beforeImage ?? '');
  const [afterImage, setAfterImage] = useState(item?.afterImage ?? '');

  const canSubmit = title.trim() && beforeImage && afterImage && !isPending;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit({ title: title.trim(), description: description.trim(), beforeImage, afterImage });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto bg-white p-8">
        <h2 className="font-montserrat text-xl font-semibold">
          {item ? 'Modifier l\'element' : 'Ajouter un avant/apres'}
        </h2>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div>
            <label htmlFor="gallery-title" className="block text-sm font-medium">
              Titre
            </label>
            <input
              id="gallery-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-1 w-full border border-gray/30 px-4 py-3 text-sm focus:border-bois focus:outline-none"
              placeholder="Ex: Transformation naturelle"
            />
          </div>

          <div>
            <label htmlFor="gallery-desc" className="block text-sm font-medium">
              Description (optionnel)
            </label>
            <textarea
              id="gallery-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1 w-full resize-none border border-gray/30 px-4 py-3 text-sm focus:border-bois focus:outline-none"
              placeholder="Description de la transformation..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <ImageUpload label="Photo avant" value={beforeImage} onChange={setBeforeImage} />
            <ImageUpload label="Photo apres" value={afterImage} onChange={setAfterImage} />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={!canSubmit}
              className="flex-1 bg-bois py-3 text-sm font-semibold text-white transition-colors hover:bg-bois/90 disabled:opacity-50"
            >
              {isPending ? 'Enregistrement...' : item ? 'Modifier' : 'Ajouter'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 border border-gray/30 py-3 text-sm font-medium transition-colors hover:bg-bois-light"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
