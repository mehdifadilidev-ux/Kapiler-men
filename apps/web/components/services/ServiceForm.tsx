'use client';

import { useState } from 'react';
import { ImageUpload } from '@/components/ui/ImageUpload';
import type { Service } from '@kpil/shared';

const SERVICE_SECTIONS = [
  'Image masculine - Barbe & Visage',
  'Diagnostic & Bilan capillaire',
  'Transformations capillaires',
  'Entretien du complement',
  'Renouvellements',
] as const;

interface ServiceFormData {
  title: string;
  description: string;
  image: string;
  features: string[];
  price: number | undefined;
  duration: string;
  section: string;
}

interface ServiceFormProps {
  item?: Service;
  onSubmit: (data: ServiceFormData) => void;
  onCancel: () => void;
  isPending: boolean;
}

export function ServiceForm({ item, onSubmit, onCancel, isPending }: ServiceFormProps) {
  const [title, setTitle] = useState(item?.title ?? '');
  const [description, setDescription] = useState(item?.description ?? '');
  const [image, setImage] = useState(item?.image ?? '');
  const [features, setFeatures] = useState<string[]>(item?.features ?? []);
  const [newFeature, setNewFeature] = useState('');
  const [price, setPrice] = useState(item?.price ? String(item.price) : '');
  const [duration, setDuration] = useState(item?.duration ?? '');
  const [section, setSection] = useState(item?.section ?? '');

  const canSubmit = title.trim() && !isPending;

  const handleAddFeature = () => {
    const trimmed = newFeature.trim();
    if (!trimmed) return;
    setFeatures([...features, trimmed]);
    setNewFeature('');
  };

  const handleFeatureKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddFeature();
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      image,
      features,
      price: price ? parseFloat(price) : undefined,
      duration: duration.trim(),
      section: section.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto bg-white p-8">
        <h2 className="font-montserrat text-xl font-semibold">
          {item ? 'Modifier la prestation' : 'Ajouter une prestation'}
        </h2>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* Section */}
          <div>
            <label htmlFor="service-section" className="block text-sm font-medium">
              Section
            </label>
            <select
              id="service-section"
              value={section}
              onChange={(e) => setSection(e.target.value)}
              className="mt-1 w-full border border-gray/30 bg-white px-4 py-3 text-sm focus:border-bois focus:outline-none"
            >
              <option value="">&mdash; Aucune &mdash;</option>
              {SERVICE_SECTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Titre */}
          <div>
            <label htmlFor="service-title" className="block text-sm font-medium">
              Titre
            </label>
            <input
              id="service-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-1 w-full border border-gray/30 px-4 py-3 text-sm focus:border-bois focus:outline-none"
              placeholder="Ex: Transformation Essentielle"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="service-desc" className="block text-sm font-medium">
              Note / description (optionnel)
            </label>
            <textarea
              id="service-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="mt-1 w-full resize-none border border-gray/30 px-4 py-3 text-sm focus:border-bois focus:outline-none"
              placeholder="Ex: Transformation realisee apres diagnostic capillaire..."
            />
          </div>

          {/* Image */}
          <ImageUpload label="Image de la prestation (optionnel)" value={image} onChange={setImage} />

          {/* Features */}
          <div>
            <label className="block text-sm font-medium">Inclus dans la prestation</label>

            {features.length > 0 && (
              <ul className="mt-2 space-y-2">
                {features.map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between border border-bois-light px-4 py-2 text-sm"
                  >
                    <span>{feature}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(index)}
                      className="text-xs text-red-600 hover:underline"
                    >
                      Retirer
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-2 flex gap-2">
              <input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                onKeyDown={handleFeatureKeyDown}
                className="flex-1 border border-gray/30 px-4 py-2 text-sm focus:border-bois focus:outline-none"
                placeholder="Ex: Coupe et coiffage inclus"
              />
              <button
                type="button"
                onClick={handleAddFeature}
                disabled={!newFeature.trim()}
                className="bg-bois-light px-4 py-2 text-sm font-medium text-bois transition-colors hover:bg-bois hover:text-white disabled:opacity-50"
              >
                Ajouter
              </button>
            </div>
          </div>

          {/* Prix + Durée */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="service-price" className="block text-sm font-medium">
                Prix (&euro;)
              </label>
              <input
                id="service-price"
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="mt-1 w-full border border-gray/30 px-4 py-3 text-sm focus:border-bois focus:outline-none"
                placeholder="Ex: 450"
              />
            </div>
            <div>
              <label htmlFor="service-duration" className="block text-sm font-medium">
                Duree
              </label>
              <input
                id="service-duration"
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="mt-1 w-full border border-gray/30 px-4 py-3 text-sm focus:border-bois focus:outline-none"
                placeholder="Ex: 2 h 40"
              />
            </div>
          </div>

          {/* Actions */}
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
