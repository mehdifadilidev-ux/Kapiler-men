'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';
import type { Service } from '@kpil/shared';

export function PrestationsContent() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get<Service[]>('/services')
      .then(setServices)
      .catch(() => setServices([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="mx-auto max-w-5xl px-6 py-24">
      <h1 className="font-montserrat text-4xl font-semibold">Nos prestations</h1>
      <p className="mt-4 text-gray">Des solutions capillaires adaptees a vos besoins.</p>

      <div className="mt-16 space-y-12">
        {loading ? (
          <p className="text-gray">Chargement...</p>
        ) : services.length > 0 ? (
          services.map((service) => (
            <div
              key={service.id}
              className="overflow-hidden border border-bois-light md:flex"
            >
              {/* Image */}
              {service.image ? (
                <div className="relative h-64 md:h-auto md:w-80">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 320px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="h-64 bg-bois-light md:h-auto md:w-80" />
              )}

              {/* Content */}
              <div className="flex min-w-0 flex-1 flex-col justify-between p-8">
                <div className="min-w-0 break-words">
                  <h2 className="font-montserrat text-2xl font-semibold">{service.title}</h2>

                  {service.description && (
                    <p className="mt-3 text-sm leading-relaxed text-gray">{service.description}</p>
                  )}

                  {/* Features list */}
                  {service.features.length > 0 && (
                    <ul className="mt-6 space-y-2">
                      {service.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3 text-sm">
                          <span className="mt-0.5 text-bois">&#10003;</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="mt-8 flex items-center justify-between">
                  {service.price ? (
                    <p className="text-2xl font-semibold text-bois">{service.price} &euro;</p>
                  ) : (
                    <p className="text-sm text-gray">Prix sur devis</p>
                  )}
                  <Link
                    href="/reserver"
                    className="bg-bois px-6 py-3 text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:bg-bois/90"
                  >
                    Reserver
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray">Les prestations seront bientot disponibles.</p>
        )}
      </div>
    </main>
  );
}
