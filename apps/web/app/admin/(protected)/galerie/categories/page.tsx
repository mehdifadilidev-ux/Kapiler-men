'use client';

import { useState } from 'react';
import {
  useGalleryCategories,
  useCreateGalleryCategory,
  useUpdateGalleryCategory,
  useDeleteGalleryCategory,
} from '@/queries/useGalleryCategories';
import type { GalleryCategory } from '@kpil/shared';

type ModalState =
  | { type: 'closed' }
  | { type: 'create' }
  | { type: 'edit'; item: GalleryCategory };

export default function AdminGalleryCategoriesPage() {
  const { data: categories, isLoading } = useGalleryCategories();
  const createCategory = useCreateGalleryCategory();
  const updateCategory = useUpdateGalleryCategory();
  const deleteCategory = useDeleteGalleryCategory();
  const [modal, setModal] = useState<ModalState>({ type: 'closed' });
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');

  const openCreate = () => {
    setName('');
    setSlug('');
    setModal({ type: 'create' });
  };

  const openEdit = (item: GalleryCategory) => {
    setName(item.name);
    setSlug(item.slug);
    setModal({ type: 'edit', item });
  };

  const generateSlug = (value: string) => {
    return value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleNameChange = (value: string) => {
    setName(value);
    if (modal.type === 'create') {
      setSlug(generateSlug(value));
    }
  };

  const handleCreate = () => {
    createCategory.mutate(
      { name, slug },
      { onSuccess: () => setModal({ type: 'closed' }) },
    );
  };

  const handleUpdate = (id: string) => {
    updateCategory.mutate(
      { id, dto: { name, slug } },
      { onSuccess: () => setModal({ type: 'closed' }) },
    );
  };

  const handleDelete = (id: string) => {
    deleteCategory.mutate(id, {
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
        <h1 className="font-montserrat text-3xl font-semibold">Categories galerie</h1>
        <button
          onClick={openCreate}
          className="bg-bois px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-bois/90"
        >
          Ajouter
        </button>
      </div>

      <p className="mt-2 text-sm text-gray">
        {categories?.length ?? 0} categorie{(categories?.length ?? 0) > 1 ? 's' : ''}
      </p>

      <div className="mt-10 divide-y divide-bois-light">
        {categories && categories.length > 0 ? (
          categories.map((cat) => (
            <div key={cat.id} className="flex items-center justify-between gap-6 py-6">
              <div className="min-w-0 flex-1">
                <h2 className="font-montserrat font-semibold">{cat.name}</h2>
                <p className="mt-1 text-xs text-gray">/{cat.slug}</p>
              </div>

              <div className="flex shrink-0 gap-4">
                <button
                  onClick={() => openEdit(cat)}
                  className="text-sm text-bois hover:underline"
                >
                  Modifier
                </button>
                {confirmDelete === cat.id ? (
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleDelete(cat.id)}
                      disabled={deleteCategory.isPending}
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
                    onClick={() => setConfirmDelete(cat.id)}
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
            <p className="text-gray">Aucune categorie.</p>
            <button
              onClick={openCreate}
              className="mt-4 text-sm font-semibold text-bois underline underline-offset-4"
            >
              Creer la premiere
            </button>
          </div>
        )}
      </div>

      {/* Modal create/edit */}
      {modal.type !== 'closed' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-lg bg-white p-8">
            <h2 className="font-montserrat text-xl font-semibold">
              {modal.type === 'create' ? 'Nouvelle categorie' : 'Modifier la categorie'}
            </h2>

            <div className="mt-6 space-y-4">
              <div>
                <label className="text-sm font-medium">Nom</label>
                <input
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="mt-1 w-full border border-bois-light px-4 py-2 text-sm"
                  placeholder="Ex: Avant / Apres"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Slug</label>
                <input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="mt-1 w-full border border-bois-light px-4 py-2 text-sm"
                  placeholder="Ex: avant-apres"
                />
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
                disabled={!name || !slug || createCategory.isPending || updateCategory.isPending}
                className="bg-bois px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-bois/90 disabled:opacity-50"
              >
                {modal.type === 'create' ? 'Creer' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
