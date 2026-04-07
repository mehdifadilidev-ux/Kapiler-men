'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  useGalleryItems,
  useCreateGalleryItem,
  useUpdateGalleryItem,
  useDeleteGalleryItem,
} from '@/queries/useGallery';
import { GalleryForm } from '@/components/gallery/GalleryForm';
import type { GalleryItem } from '@kpil/shared';

type ModalState =
  | { type: 'closed' }
  | { type: 'create' }
  | { type: 'edit'; item: GalleryItem };

export default function AdminGaleriePage() {
  const { data: items, isLoading } = useGalleryItems();
  const createItem = useCreateGalleryItem();
  const updateItem = useUpdateGalleryItem();
  const deleteItem = useDeleteGalleryItem();
  const [modal, setModal] = useState<ModalState>({ type: 'closed' });
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const handleCreate = (data: { title: string; description: string; beforeImage: string; afterImage: string }) => {
    createItem.mutate(data, {
      onSuccess: () => setModal({ type: 'closed' }),
    });
  };

  const handleUpdate = (id: string, data: { title: string; description: string; beforeImage: string; afterImage: string }) => {
    updateItem.mutate(
      { id, dto: data },
      { onSuccess: () => setModal({ type: 'closed' }) },
    );
  };

  const handleDelete = (id: string) => {
    deleteItem.mutate(id, {
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
        <h1 className="font-montserrat text-3xl font-semibold">Galerie avant/apres</h1>
        <button
          onClick={() => setModal({ type: 'create' })}
          className="bg-bois px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-bois/90"
        >
          Ajouter
        </button>
      </div>

      <p className="mt-2 text-sm text-gray">
        {items?.length ?? 0} element{(items?.length ?? 0) > 1 ? 's' : ''}
      </p>

      <div className="mt-10 divide-y divide-bois-light">
        {items && items.length > 0 ? (
          items.map((item) => (
            <div key={item.id} className="flex items-center gap-6 py-6">
              {/* Thumbnails */}
              <div className="flex shrink-0 gap-2">
                {item.beforeImage ? (
                  <Image
                    src={item.beforeImage}
                    alt={`${item.title} - avant`}
                    width={120}
                    height={90}
                    className="h-20 w-28 rounded border border-bois-light object-cover"
                  />
                ) : (
                  <div className="h-20 w-28 rounded bg-bois-light" />
                )}
                {item.afterImage ? (
                  <Image
                    src={item.afterImage}
                    alt={`${item.title} - apres`}
                    width={120}
                    height={90}
                    className="h-20 w-28 rounded border border-bois-light object-cover"
                  />
                ) : (
                  <div className="h-20 w-28 rounded bg-bois-light" />
                )}
              </div>

              {/* Info + Actions */}
              <div className="flex min-w-0 flex-1 items-center justify-between">
                <div className="min-w-0 flex-1 break-words">
                  <h2 className="font-montserrat font-semibold">{item.title}</h2>
                  {item.description && (
                    <p className="mt-1 text-sm text-gray">{item.description}</p>
                  )}
                </div>

                <div className="flex shrink-0 gap-4">
                  <button
                    onClick={() => setModal({ type: 'edit', item })}
                    className="text-sm text-bois hover:underline"
                  >
                    Modifier
                  </button>
                  {confirmDelete === item.id ? (
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleDelete(item.id)}
                        disabled={deleteItem.isPending}
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
            </div>
          ))
        ) : (
          <div className="py-16 text-center">
            <p className="text-gray">Aucun element dans la galerie.</p>
            <button
              onClick={() => setModal({ type: 'create' })}
              className="mt-4 text-sm font-semibold text-bois underline underline-offset-4"
            >
              Ajouter le premier
            </button>
          </div>
        )}
      </div>

      {/* Modal create */}
      {modal.type === 'create' && (
        <GalleryForm
          onSubmit={handleCreate}
          onCancel={() => setModal({ type: 'closed' })}
          isPending={createItem.isPending}
        />
      )}

      {/* Modal edit */}
      {modal.type === 'edit' && (
        <GalleryForm
          item={modal.item}
          onSubmit={(data) => handleUpdate(modal.item.id, data)}
          onCancel={() => setModal({ type: 'closed' })}
          isPending={updateItem.isPending}
        />
      )}
    </div>
  );
}
