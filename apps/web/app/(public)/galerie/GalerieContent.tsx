'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { apiClient } from '@/lib/api-client';
import type { GalleryItem } from '@kpil/shared';

export function GalerieContent() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get<GalleryItem[]>('/gallery')
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="mx-auto max-w-6xl overflow-hidden px-6 py-24">
      <h1 className="font-montserrat text-4xl font-semibold">Galerie</h1>
      <p className="mt-4 text-gray">Decouvrez nos realisations en images.</p>

      <div className="mt-16 space-y-10">
        {loading ? (
          <p className="text-gray">Chargement...</p>
        ) : items.length > 0 ? (
          items.map((item) => (
            <div key={item.id} className="overflow-hidden border border-bois-light">
              {item.type === 'before_after' && item.afterImage ? (
                <div className="grid gap-3 p-3 md:grid-cols-2">
                  <div className="relative">
                    <span className="absolute left-4 top-4 z-10 bg-black/60 px-3 py-1 text-xs font-medium uppercase tracking-widest text-white">
                      Avant
                    </span>
                    <Image
                      src={item.beforeImage}
                      alt={`${item.title} - avant`}
                      width={700}
                      height={500}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="aspect-[4/3] w-full object-cover"
                    />
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-4 z-10 bg-bois px-3 py-1 text-xs font-medium uppercase tracking-widest text-white">
                      Apres
                    </span>
                    <Image
                      src={item.afterImage}
                      alt={`${item.title} - apres`}
                      width={700}
                      height={500}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="aspect-[4/3] w-full object-cover"
                    />
                  </div>
                </div>
              ) : (
                <div className="p-3">
                  <Image
                    src={item.beforeImage}
                    alt={item.title}
                    width={1400}
                    height={500}
                    sizes="(max-width: 768px) 100vw, 80vw"
                    className="aspect-[16/9] w-full object-cover"
                  />
                </div>
              )}
              <div className="break-words px-6 py-5">
                <h2 className="font-montserrat text-lg font-semibold">{item.title}</h2>
                {item.description && (
                  <p className="mt-2 text-sm leading-relaxed text-gray">{item.description}</p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray">La galerie sera bientot alimentee.</p>
        )}
      </div>

      {/* Social links */}
      <div className="mt-16 text-center">
        <p className="text-sm text-gray">Suivez-nous pour plus de resultats</p>
        <div className="mt-4 flex justify-center gap-6">
          <a
            href="https://www.instagram.com/kpilr_men/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-bois underline underline-offset-4 hover:text-bois/80"
          >
            Instagram
          </a>
          <a
            href="https://www.tiktok.com/@kpilr_men"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-bois underline underline-offset-4 hover:text-bois/80"
          >
            TikTok
          </a>
        </div>
      </div>
    </main>
  );
}
