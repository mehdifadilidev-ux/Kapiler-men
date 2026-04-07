'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  useServices,
  useCreateService,
  useUpdateService,
  useDeleteService,
} from '@/queries/useServices';
import { ServiceForm } from '@/components/services/ServiceForm';
import type { Service } from '@kpil/shared';

type ModalState =
  | { type: 'closed' }
  | { type: 'create' }
  | { type: 'edit'; item: Service };

export default function AdminServicesPage() {
  const { data: services, isLoading } = useServices();
  const createService = useCreateService();
  const updateService = useUpdateService();
  const deleteService = useDeleteService();
  const [modal, setModal] = useState<ModalState>({ type: 'closed' });
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const handleCreate = (data: { title: string; image: string; features: string[]; price: number | undefined }) => {
    createService.mutate(
      { title: data.title, image: data.image || undefined, features: data.features, price: data.price },
      { onSuccess: () => setModal({ type: 'closed' }) },
    );
  };

  const handleUpdate = (id: string, data: { title: string; image: string; features: string[]; price: number | undefined }) => {
    updateService.mutate(
      { id, dto: { title: data.title, image: data.image || undefined, features: data.features, price: data.price } },
      { onSuccess: () => setModal({ type: 'closed' }) },
    );
  };

  const handleDelete = (id: string) => {
    deleteService.mutate(id, {
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
        <h1 className="font-montserrat text-3xl font-semibold">Prestations</h1>
        <button
          onClick={() => setModal({ type: 'create' })}
          className="bg-bois px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-bois/90"
        >
          Ajouter
        </button>
      </div>

      <p className="mt-2 text-sm text-gray">
        {services?.length ?? 0} prestation{(services?.length ?? 0) > 1 ? 's' : ''}
      </p>

      <div className="mt-10 divide-y divide-bois-light">
        {services && services.length > 0 ? (
          services.map((service) => (
            <div key={service.id} className="flex items-center gap-6 py-6">
              {/* Thumbnail */}
              {service.image ? (
                <Image
                  src={service.image}
                  alt={service.title}
                  width={120}
                  height={80}
                  className="h-20 w-28 shrink-0 rounded border border-bois-light object-cover"
                />
              ) : (
                <div className="h-20 w-28 shrink-0 rounded bg-bois-light" />
              )}

              {/* Info + Actions */}
              <div className="flex min-w-0 flex-1 items-center justify-between">
                <div className="min-w-0 flex-1 break-words">
                  <div className="flex items-center gap-3">
                    <h2 className="truncate font-montserrat font-semibold">{service.title}</h2>
                    <span
                      className={`text-xs ${service.isActive ? 'text-green-600' : 'text-red-600'}`}
                    >
                      {service.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  {service.price && (
                    <p className="mt-1 text-sm font-semibold text-bois">{service.price} &euro;</p>
                  )}
                  {service.features.length > 0 && (
                    <p className="mt-1 text-xs text-gray">
                      {service.features.length} element{service.features.length > 1 ? 's' : ''} inclus
                    </p>
                  )}
                </div>

                <div className="flex shrink-0 gap-4">
                  <button
                    onClick={() => setModal({ type: 'edit', item: service })}
                    className="text-sm text-bois hover:underline"
                  >
                    Modifier
                  </button>
                  {confirmDelete === service.id ? (
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleDelete(service.id)}
                        disabled={deleteService.isPending}
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
                      onClick={() => setConfirmDelete(service.id)}
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
            <p className="text-gray">Aucune prestation.</p>
            <button
              onClick={() => setModal({ type: 'create' })}
              className="mt-4 text-sm font-semibold text-bois underline underline-offset-4"
            >
              Ajouter la premiere
            </button>
          </div>
        )}
      </div>

      {/* Modal create */}
      {modal.type === 'create' && (
        <ServiceForm
          onSubmit={handleCreate}
          onCancel={() => setModal({ type: 'closed' })}
          isPending={createService.isPending}
        />
      )}

      {/* Modal edit */}
      {modal.type === 'edit' && (
        <ServiceForm
          item={modal.item}
          onSubmit={(data) => handleUpdate(modal.item.id, data)}
          onCancel={() => setModal({ type: 'closed' })}
          isPending={updateService.isPending}
        />
      )}
    </div>
  );
}
