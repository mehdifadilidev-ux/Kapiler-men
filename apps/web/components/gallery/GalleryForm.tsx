'use client';

import { useState } from 'react';
import { ImageUpload } from '@/components/ui/ImageUpload';
import type { GalleryItem } from '@kpil/shared';

interface GalleryFormData {
  type: 'single' | 'before_after';
  title: string;
  description: string;
  beforeImage: string;
  afterImage: string;
  imageAlt: string;
  imageTitle: string;
}

interface GalleryFormProps {
  item?: GalleryItem;
  onSubmit: (data: GalleryFormData) => void;
  onCancel: () => void;
  isPending: boolean;
}

export function GalleryForm({ item, onSubmit, onCancel, isPending }: GalleryFormProps) {
  const [type, setType] = useState<'single' | 'before_after'>(item?.type ?? 'before_after');
  const [title, setTitle] = useState(item?.title ?? '');
  const [description, setDescription] = useState(item?.description ?? '');
  const [beforeImage, setBeforeImage] = useState(item?.beforeImage ?? '');
  const [afterImage, setAfterImage] = useState(item?.afterImage ?? '');
  const [imageAlt, setImageAlt] = useState(item?.imageAlt ?? '');
  const [imageTitle, setImageTitle] = useState(item?.imageTitle ?? '');

  const canSubmit =
    title.trim() &&
    beforeImage &&
    (type === 'single' || afterImage) &&
    !isPending;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit({
      type,
      title: title.trim(),
      description: description.trim(),
      beforeImage,
      afterImage,
      imageAlt: imageAlt.trim(),
      imageTitle: imageTitle.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto bg-white p-8">
        <h2 className="font-montserrat text-xl font-semibold">
          {item ? 'Modifier l\'élément' : 'Ajouter à la galerie'}
        </h2>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
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
                Avant / Après
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
              <ImageUpload
                label="Photo avant"
                value={beforeImage}
                onChange={setBeforeImage}
                slug={title.trim() || undefined}
                folder="gallery"
              />
              <ImageUpload
                label="Photo après"
                value={afterImage}
                onChange={setAfterImage}
                slug={title.trim() || undefined}
                folder="gallery"
              />
            </div>
          ) : (
            <ImageUpload
              label="Photo"
              value={beforeImage}
              onChange={setBeforeImage}
              slug={title.trim() || undefined}
              folder="gallery"
            />
          )}

          {/* SEO — alt + title des images */}
          {beforeImage && (
            <div className="space-y-4 border-l-2 border-bois-light pl-4">
              <p className="text-xs font-medium uppercase tracking-widest text-bois">
                SEO de{type === 'before_after' ? 's images' : " l'image"}
              </p>
              <div>
                <label htmlFor="gallery-image-alt" className="block text-sm font-medium">
                  Texte alternatif (alt)
                </label>
                <input
                  id="gallery-image-alt"
                  type="text"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  maxLength={255}
                  className="mt-1 w-full border border-gray/30 px-4 py-3 text-sm focus:border-bois focus:outline-none"
                  placeholder="Ex: Transformation capillaire homme, résultat naturel, vue de face"
                />
                <p className="mt-1 text-xs text-gray">
                  Décrit la photo pour Google et les lecteurs d&apos;écran. Si vide, le titre est
                  utilisé.
                  {type === 'before_after' && ' « – avant » / « – après » est ajouté automatiquement.'}
                </p>
              </div>
              <div>
                <label htmlFor="gallery-image-title" className="block text-sm font-medium">
                  Titre (tooltip au survol)
                </label>
                <input
                  id="gallery-image-title"
                  type="text"
                  value={imageTitle}
                  onChange={(e) => setImageTitle(e.target.value)}
                  maxLength={255}
                  className="mt-1 w-full border border-gray/30 px-4 py-3 text-sm focus:border-bois focus:outline-none"
                  placeholder="Ex: Transformation naturelle — KPIL'R Men Orléans"
                />
                <p className="mt-1 text-xs text-gray">S&apos;affiche au survol. Optionnel.</p>
              </div>
            </div>
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
