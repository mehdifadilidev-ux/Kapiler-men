'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  usePartnerBrands,
  useCreatePartnerBrand,
  useUpdatePartnerBrand,
  useDeletePartnerBrand,
  useTogglePartnerBrandVisibility,
} from '@/queries/usePartnerBrands';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { useToast } from '@/components/ui/Toast';
import { getErrorMessage } from '@/lib/errors';
import type { PartnerBrand } from '@kpil/shared';

type ModalState =
  | { type: 'closed' }
  | { type: 'create' }
  | { type: 'edit'; item: PartnerBrand };

export default function AdminMarquesPage() {
  const { data: brands, isLoading } = usePartnerBrands();
  const createBrand = useCreatePartnerBrand();
  const updateBrand = useUpdatePartnerBrand();
  const deleteBrand = useDeletePartnerBrand();
  const toggleVisibility = useTogglePartnerBrandVisibility();
  const toast = useToast();
  const [modal, setModal] = useState<ModalState>({ type: 'closed' });
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [logo, setLogo] = useState('');
  const [website, setWebsite] = useState('');

  const openCreate = () => {
    setName('');
    setLogo('');
    setWebsite('');
    setModal({ type: 'create' });
  };

  const openEdit = (item: PartnerBrand) => {
    setName(item.name);
    setLogo(item.logo);
    setWebsite(item.website ?? '');
    setModal({ type: 'edit', item });
  };

  const buildDto = () => {
    const trimmed = website.trim();
    const normalizedWebsite = trimmed && !/^https?:\/\//i.test(trimmed) ? `https://${trimmed}` : trimmed;
    return {
      name,
      logo,
      ...(normalizedWebsite ? { website: normalizedWebsite } : {}),
    };
  };

  const handleCreate = () => {
    createBrand.mutate(buildDto(), {
      onSuccess: () => {
        setModal({ type: 'closed' });
        toast.success('Marque ajoutée', 'La marque est désormais disponible.');
      },
      onError: (err) => toast.error('Création impossible', getErrorMessage(err)),
    });
  };

  const handleUpdate = (id: string) => {
    updateBrand.mutate(
      { id, dto: buildDto() },
      {
        onSuccess: () => {
          setModal({ type: 'closed' });
          toast.success('Marque mise à jour', 'Les modifications ont été enregistrées.');
        },
        onError: (err) => toast.error('Modification impossible', getErrorMessage(err)),
      },
    );
  };

  const handleDelete = (id: string) => {
    deleteBrand.mutate(id, {
      onSuccess: () => {
        setConfirmDelete(null);
        toast.success('Marque supprimée', 'La marque a été retirée de la liste.');
      },
      onError: (err) => toast.error('Suppression impossible', getErrorMessage(err)),
    });
  };

  const handleToggleVisibility = (id: string, isVisible: boolean) => {
    toggleVisibility.mutate(id, {
      onSuccess: () =>
        toast.success(
          isVisible ? 'Marque masquée' : 'Marque affichée',
          isVisible
            ? 'Elle n’apparaît plus sur le site public.'
            : 'Elle est désormais visible sur le site public.',
        ),
      onError: (err) => toast.error('Action impossible', getErrorMessage(err)),
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
        <h1 className="font-montserrat text-3xl font-semibold">Marques partenaires</h1>
        <button
          onClick={openCreate}
          className="bg-bois px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-bois/90"
        >
          Ajouter
        </button>
      </div>

      <p className="mt-2 text-sm text-gray">
        {brands?.length ?? 0} marque{(brands?.length ?? 0) > 1 ? 's' : ''}
      </p>

      <div className="mt-10 divide-y divide-bois-light">
        {brands && brands.length > 0 ? (
          brands.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-6 py-6">
              <div className="flex min-w-0 flex-1 items-center gap-4">
                <div className="relative h-16 w-24 shrink-0 border border-bois-light bg-white">
                  <Image
                    src={item.logo}
                    alt={item.name}
                    fill
                    sizes="96px"
                    className="object-contain p-2"
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    <h2 className="font-montserrat font-semibold">{item.name}</h2>
                    <span
                      className={`text-xs font-medium ${
                        item.isVisible ? 'text-green-600' : 'text-gray'
                      }`}
                    >
                      {item.isVisible ? 'Visible' : 'Masqué'}
                    </span>
                  </div>
                  {item.website && (
                    <p className="mt-1 truncate text-xs text-gray">{item.website}</p>
                  )}
                </div>
              </div>

              <div className="flex shrink-0 gap-4">
                <button
                  onClick={() => handleToggleVisibility(item.id, item.isVisible)}
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
                      disabled={deleteBrand.isPending}
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
            <p className="text-gray">Aucune marque partenaire.</p>
            <button
              onClick={openCreate}
              className="mt-4 text-sm font-semibold text-bois underline underline-offset-4"
            >
              Ajouter la premiere
            </button>
          </div>
        )}
      </div>

      {modal.type !== 'closed' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto bg-white p-8">
            <h2 className="font-montserrat text-xl font-semibold">
              {modal.type === 'create' ? 'Nouvelle marque' : 'Modifier la marque'}
            </h2>

            <div className="mt-6 space-y-4">
              <div>
                <label className="text-sm font-medium">Nom</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full border border-bois-light px-4 py-2 text-sm"
                  placeholder="Ex: Hairdreams"
                />
              </div>

              <ImageUpload label="Logo" value={logo} onChange={setLogo} />

              <div>
                <label className="text-sm font-medium">Site web (optionnel)</label>
                <input
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="mt-1 w-full border border-bois-light px-4 py-2 text-sm"
                  placeholder="https://exemple.com"
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
                disabled={!name || !logo || createBrand.isPending || updateBrand.isPending}
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
