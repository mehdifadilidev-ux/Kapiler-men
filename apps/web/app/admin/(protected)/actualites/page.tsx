'use client';

import { useState } from 'react';
import {
  useNewsBanners,
  useCreateNewsBanner,
  useUpdateNewsBanner,
  useDeleteNewsBanner,
  useActivateNewsBanner,
} from '@/queries/useNewsBanner';
import { useToast } from '@/components/ui/Toast';
import { getErrorMessage } from '@/lib/errors';
import type { NewsBanner } from '@kpil/shared';

type ModalState =
  | { type: 'closed' }
  | { type: 'create' }
  | { type: 'edit'; item: NewsBanner };

export default function AdminActualitesPage() {
  const { data: banners, isLoading } = useNewsBanners();
  const createBanner = useCreateNewsBanner();
  const updateBanner = useUpdateNewsBanner();
  const deleteBanner = useDeleteNewsBanner();
  const activateBanner = useActivateNewsBanner();
  const toast = useToast();
  const [modal, setModal] = useState<ModalState>({ type: 'closed' });
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const [text, setText] = useState('');
  const [link, setLink] = useState('');
  const [bannerType, setBannerType] = useState<'info' | 'promo' | 'event'>('info');

  const openCreate = () => {
    setText('');
    setLink('');
    setBannerType('info');
    setModal({ type: 'create' });
  };

  const openEdit = (item: NewsBanner) => {
    setText(item.text);
    setLink(item.link ?? '');
    setBannerType(item.type);
    setModal({ type: 'edit', item });
  };

  const handleCreate = () => {
    createBanner.mutate(
      { text, link: link || undefined, type: bannerType },
      {
        onSuccess: () => {
          setModal({ type: 'closed' });
          toast.success('Banniere creee', 'La banniere a ete ajoutee.');
        },
        onError: (err) => toast.error('Creation impossible', getErrorMessage(err)),
      },
    );
  };

  const handleUpdate = (id: string) => {
    updateBanner.mutate(
      { id, dto: { text, link: link || undefined, type: bannerType } },
      {
        onSuccess: () => {
          setModal({ type: 'closed' });
          toast.success('Banniere mise a jour', 'Les modifications ont ete enregistrees.');
        },
        onError: (err) => toast.error('Modification impossible', getErrorMessage(err)),
      },
    );
  };

  const handleDelete = (id: string) => {
    deleteBanner.mutate(id, {
      onSuccess: () => {
        setConfirmDelete(null);
        toast.success('Banniere supprimee', 'La banniere a ete retiree.');
      },
      onError: (err) => toast.error('Suppression impossible', getErrorMessage(err)),
    });
  };

  const handleActivate = (id: string) => {
    activateBanner.mutate(id, {
      onSuccess: () => toast.success('Banniere activee', 'Elle s’affiche desormais sur le site.'),
      onError: (err) => toast.error('Activation impossible', getErrorMessage(err)),
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
        <h1 className="font-montserrat text-3xl font-semibold">Banniere actualites</h1>
        <button
          onClick={openCreate}
          className="bg-bois px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-bois/90"
        >
          Ajouter
        </button>
      </div>

      <p className="mt-2 text-sm text-gray">
        {banners?.length ?? 0} banniere{(banners?.length ?? 0) > 1 ? 's' : ''}
      </p>

      <div className="mt-10 divide-y divide-bois-light">
        {banners && banners.length > 0 ? (
          banners.map((banner) => (
            <div key={banner.id} className="flex items-center justify-between gap-6 py-6">
              <div className="min-w-0 flex-1 break-words">
                <div className="flex items-center gap-3">
                  <h2 className="font-montserrat font-semibold">{banner.text}</h2>
                  <span
                    className={`text-xs font-medium ${
                      banner.isActive ? 'text-green-600' : 'text-gray'
                    }`}
                  >
                    {banner.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <span className="rounded bg-bois-light px-2 py-0.5 text-xs">{banner.type}</span>
                </div>
                {banner.link && (
                  <p className="mt-1 text-xs text-gray">{banner.link}</p>
                )}
              </div>

              <div className="flex shrink-0 gap-4">
                {!banner.isActive && (
                  <button
                    onClick={() => handleActivate(banner.id)}
                    disabled={activateBanner.isPending}
                    className="text-sm text-green-600 hover:underline disabled:opacity-50"
                  >
                    Activer
                  </button>
                )}
                <button
                  onClick={() => openEdit(banner)}
                  className="text-sm text-bois hover:underline"
                >
                  Modifier
                </button>
                {confirmDelete === banner.id ? (
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleDelete(banner.id)}
                      disabled={deleteBanner.isPending}
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
                    onClick={() => setConfirmDelete(banner.id)}
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
            <p className="text-gray">Aucune banniere.</p>
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
              {modal.type === 'create' ? 'Nouvelle banniere' : 'Modifier la banniere'}
            </h2>

            <div className="mt-6 space-y-4">
              <div>
                <label className="text-sm font-medium">Texte</label>
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="mt-1 w-full border border-bois-light px-4 py-2 text-sm"
                  placeholder="Texte de la banniere"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Lien (optionnel)</label>
                <input
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  className="mt-1 w-full border border-bois-light px-4 py-2 text-sm"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="text-sm font-medium">Type</label>
                <select
                  value={bannerType}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === 'info' || val === 'promo' || val === 'event') {
                      setBannerType(val);
                    }
                  }}
                  className="mt-1 w-full border border-bois-light px-4 py-2 text-sm"
                >
                  <option value="info">Info</option>
                  <option value="promo">Promo</option>
                  <option value="event">Evenement</option>
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
                disabled={!text || createBanner.isPending || updateBanner.isPending}
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
