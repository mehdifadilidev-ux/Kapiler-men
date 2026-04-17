'use client';

import { useState } from 'react';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { useGalleryCategories } from '@/queries/useGalleryCategories';
import type { GalleryItem } from '@kpil/shared';

interface GalleryFormData {
  categoryId: string;
  type: 'single' | 'before_after';
  title: string;
  description: string;
  beforeImage: string;
  afterImage: string;
}

interface GalleryFormProps {
  item?: GalleryItem;
  onSubmit: (data: GalleryFormData) => void;
  onCancel: () => void;
  isPending: boolean;
}

export function GalleryForm({ item, onSubmit, onCancel, isPending }: GalleryFormProps) {
  const { data: categories } = useGalleryCategories();
  const [categoryId, setCategoryId] = useState(item?.categoryId ?? '');
  const [type, setType] = useState<'single' | 'before_after'>(item?.type ?? 'before_after');
  const [title, setTitle] = useState(item?.title ?? '');
  const [description, setDescription] = useState(item?.description ?? '');
  const [beforeImage, setBeforeImage] = useState(item?.beforeImage ?? '');
  const [afterImage, setAfterImage] = useState(item?.afterImage ?? '');

  const canSubmit =
    title.trim() &&
    categoryId &&
    beforeImage &&
    (type === 'single' || afterImage) &&
    !isPending;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit({
      categoryId,
      type,
      title: title.trim(),
      description: description.trim(),
      beforeImage,
      afterImage,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto bg-white p-8">
        <h2 className="font-montserrat text-xl font-semibold">
          {item ? 'Modifier l\'element' : 'Ajouter a la galerie'}
        </h2>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* Category */}
          <div>
            <label htmlFor="gallery-category" className="block text-sm font-medium">
              Categorie
            </label>
            <select
              id="gallery-category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              className="mt-1 w-full border border-gray/30 px-4 py-3 text-sm focus:border-bois focus:outline-none"
            >
              <option value="">Selectionner une categorie</option>
              {categories?.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium">Type</label>
            <div className="mt-2 flex gap-4">
              <button
                type="button"
                onClick={() => setType('before_after')}
                className={`flex-1 border py-2 text-sm font-medium transition-colors ${
                  type === 'before_after'
                    ? 'border-bois bg-bois text-white'
                    : 'border-gray/30 hover:bg-bois-light'
                }`}
              >
                Avant / Apres
              </button>
              <button
                type="button"
                onClick={() => setType('single')}
                className={`flex-1 border py-2 text-sm font-medium transition-colors ${
                  type === 'single'
                    ? 'border-bois bg-bois text-white'
                    : 'border-gray/30 hover:bg-bois-light'
                }`}
              >
                Photo simple
              </button>
            </div>
          </div>

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
              placeholder="Description..."
            />
          </div>

          {type === 'before_after' ? (
            <div className="grid grid-cols-2 gap-4">
              <ImageUpload label="Photo avant" value={beforeImage} onChange={setBeforeImage} />
              <ImageUpload label="Photo apres" value={afterImage} onChange={setAfterImage} />
            </div>
          ) : (
            <ImageUpload label="Photo" value={beforeImage} onChange={setBeforeImage} />
          )}

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
