import type { Metadata } from 'next';
import Image from 'next/image';
import { fetchApi } from '@/lib/fetcher';
import type { GalleryItem } from '@kpil/shared';

export const metadata: Metadata = {
  title: 'Galerie avant/apres',
  description:
    'Decouvrez nos transformations capillaires en images. Resultats avant et apres de nos clients.',
  openGraph: {
    title: 'Galerie avant/apres | KPIL R Men',
    description: 'Transformations capillaires : resultats avant et apres',
  },
};

export default async function GaleriePage() {
  const items = (await fetchApi<GalleryItem[]>('/api/gallery')) ?? [];

  return (
    <main className="mx-auto max-w-6xl overflow-hidden px-6 py-24">
      <h1 className="font-montserrat text-4xl font-semibold">Galerie avant / apres</h1>
      <p className="mt-4 text-gray">Decouvrez les transformations de nos clients.</p>

      <div className="mt-16 space-y-10">
        {items.length > 0 ? (
          items.map((item) => (
            <div key={item.id} className="overflow-hidden border border-bois-light">
              <div className="grid gap-3 p-3 md:grid-cols-2">
                {/* Avant */}
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
                {/* Apres */}
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
    </main>
  );
}
