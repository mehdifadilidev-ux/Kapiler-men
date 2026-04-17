'use client';

import { useState } from 'react';
import {
  useTestimonials,
  useCreateTestimonial,
  useUpdateTestimonial,
  useDeleteTestimonial,
  useToggleTestimonialVisibility,
} from '@/queries/useTestimonials';
import type { Testimonial } from '@kpil/shared';

type ModalState =
  | { type: 'closed' }
  | { type: 'create' }
  | { type: 'edit'; item: Testimonial };

const SOURCES = [
  { value: 'google', label: 'Google' },
  { value: 'planity', label: 'Planity' },
  { value: 'other', label: 'Autre' },
] as const;

export default function AdminTemoignagesPage() {
  const { data: testimonials, isLoading } = useTestimonials();
  const createTestimonial = useCreateTestimonial();
  const updateTestimonial = useUpdateTestimonial();
  const deleteTestimonial = useDeleteTestimonial();
  const toggleVisibility = useToggleTestimonialVisibility();
  const [modal, setModal] = useState<ModalState>({ type: 'closed' });
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const [author, setAuthor] = useState('');
  const [text, setText] = useState('');
  const [rating, setRating] = useState(5);
  const [source, setSource] = useState<'google' | 'planity' | 'other'>('google');

  const openCreate = () => {
    setAuthor('');
    setText('');
    setRating(5);
    setSource('google');
    setModal({ type: 'create' });
  };

  const openEdit = (item: Testimonial) => {
    setAuthor(item.author);
    setText(item.text);
    setRating(item.rating);
    setSource(item.source);
    setModal({ type: 'edit', item });
  };

  const handleCreate = () => {
    createTestimonial.mutate(
      { author, text, rating, source },
      { onSuccess: () => setModal({ type: 'closed' }) },
    );
  };

  const handleUpdate = (id: string) => {
    updateTestimonial.mutate(
      { id, dto: { author, text, rating, source } },
      { onSuccess: () => setModal({ type: 'closed' }) },
    );
  };

  const handleDelete = (id: string) => {
    deleteTestimonial.mutate(id, {
      onSuccess: () => setConfirmDelete(null),
    });
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-12">
        <p className="text-gray">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="flex items-center justify-between">
        <h1 className="font-montserrat text-3xl font-semibold">Temoignages</h1>
        <button
          onClick={openCreate}
          className="bg-bois px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-bois/90"
        >
          Ajouter
        </button>
      </div>

      <p className="mt-2 text-sm text-gray">
        {testimonials?.length ?? 0} temoignage{(testimonials?.length ?? 0) > 1 ? 's' : ''}
      </p>

      <div className="mt-10 divide-y divide-bois-light">
        {testimonials && testimonials.length > 0 ? (
          testimonials.map((item) => (
            <div key={item.id} className="flex items-start justify-between gap-6 py-6">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3">
                  <h2 className="font-montserrat font-semibold">{item.author}</h2>
                  <span className="rounded bg-bois-light px-2 py-0.5 text-xs">{item.source}</span>
                  <span
                    className={`text-xs font-medium ${
                      item.isVisible ? 'text-green-600' : 'text-gray'
                    }`}
                  >
                    {item.isVisible ? 'Visible' : 'Masque'}
                  </span>
                </div>
                <div className="mt-1 flex gap-0.5">
                  {Array.from({ length: 5 }, (_, i) => (
                    <span key={i} className={i < item.rating ? 'text-bois' : 'text-gray/30'}>
                      &#9733;
                    </span>
                  ))}
                </div>
                <p className="mt-2 text-sm text-gray">{item.text}</p>
              </div>

              <div className="flex shrink-0 gap-4">
                <button
                  onClick={() => toggleVisibility.mutate(item.id)}
                  disabled={toggleVisibility.isPending}
                  className="text-sm text-bois hover:underline disabled:opacity-50"
                >
                  {item.isVisible ? 'Masquer' : 'Afficher'}
                </button>
                <button
                  onClick={() => openEdit(item)}
                  className="text-sm text-bois hover:underline"
                >
                  Modifier
                </button>
                {confirmDelete === item.id ? (
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={deleteTestimonial.isPending}
                      className="text-sm font-semibold text-red-600 hover:underline disabled:opacity-50"
                    >
                      Confirmer
                    </button>
                    <button
                      onClick={() => setConfirmDelete(null)}
                      className="text-sm text-gray hover:underline"
                    >
                      Non
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmDelete(item.id)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Supprimer
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="py-16 text-center">
            <p className="text-gray">Aucun temoignage.</p>
            <button
              onClick={openCreate}
              className="mt-4 text-sm font-semibold text-bois underline underline-offset-4"
            >
              Ajouter le premier
            </button>
          </div>
        )}
      </div>

      {/* Modal create/edit */}
      {modal.type !== 'closed' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-lg bg-white p-8">
            <h2 className="font-montserrat text-xl font-semibold">
              {modal.type === 'create' ? 'Nouveau temoignage' : 'Modifier le temoignage'}
            </h2>

            <div className="mt-6 space-y-4">
              <div>
                <label className="text-sm font-medium">Prenom / Nom</label>
                <input
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="mt-1 w-full border border-bois-light px-4 py-2 text-sm"
                  placeholder="Ex: Laurent M."
                />
              </div>

              <div>
                <label className="text-sm font-medium">Avis</label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={4}
                  className="mt-1 w-full border border-bois-light px-4 py-2 text-sm"
                  placeholder="Texte du temoignage..."
                />
              </div>

              <div>
                <label className="text-sm font-medium">Note</label>
                <div className="mt-1 flex gap-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setRating(i + 1)}
                      className={`text-2xl ${i < rating ? 'text-bois' : 'text-gray/30'}`}
                    >
                      &#9733;
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Source</label>
                <select
                  value={source}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === 'google' || val === 'planity' || val === 'other') {
                      setSource(val);
                    }
                  }}
                  className="mt-1 w-full border border-bois-light px-4 py-2 text-sm"
                >
                  {SOURCES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-4">
              <button
                onClick={() => setModal({ type: 'closed' })}
                className="px-6 py-2 text-sm text-gray hover:underline"
              >
                Annuler
              </button>
              <button
                onClick={() =>
                  modal.type === 'create' ? handleCreate() : handleUpdate(modal.item.id)
                }
                disabled={!author || !text || createTestimonial.isPending || updateTestimonial.isPending}
                className="bg-bois px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-bois/90 disabled:opacity-50"
              >
                {modal.type === 'create' ? 'Ajouter' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
