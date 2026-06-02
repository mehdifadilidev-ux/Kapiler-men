import Image from 'next/image';
import { z } from 'zod';
import { galleryItemSchema, type GalleryItem } from '@kpil/shared';

const galleryArraySchema = z.array(galleryItemSchema);

async function fetchGallery(): Promise<GalleryItem[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!baseUrl) return [];
  try {
    const res = await fetch(`${baseUrl}/gallery`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    return galleryArraySchema.parse(await res.json());
  } catch {
    return [];
  }
}

export async function GalerieContent() {
  const items = await fetchGallery();

  return (
    <main className="mx-auto max-w-6xl px-6 py-24">
      {/* Header */}
      <section className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-medium uppercase tracking-[0.5em] text-gray">Réalisations</p>
        <h1 className="mt-6 font-montserrat text-4xl font-semibold md:text-5xl">Galerie</h1>
        <p className="mt-6 font-bodoni text-xl italic text-gray">
          Découvrez nos réalisations en images.
        </p>
      </section>

      {items.length > 0 ? (
        <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const altBase = item.imageAlt ?? item.title;
            const imgTitle = item.imageTitle ?? item.title;

            // Avant / Après — rangée pleine largeur
            if (item.type === 'before_after' && item.afterImage) {
              return (
                <div key={item.id} className="sm:col-span-2 lg:col-span-3">
                  <figure className="group mx-auto max-w-3xl overflow-hidden border border-bois-light">
                    <div className="grid grid-cols-2 gap-px bg-bois-light">
                      <div className="relative aspect-[4/5] overflow-hidden bg-black">
                        <span className="absolute left-3 top-3 z-10 bg-black/70 px-2.5 py-1 text-[10px] font-medium uppercase tracking-widest text-white">
                          Avant
                        </span>
                        <Image
                          src={item.beforeImage}
                          alt={`${altBase} – avant`}
                          title={imgTitle}
                          fill
                          sizes="(max-width: 768px) 50vw, 384px"
                          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                        />
                      </div>
                      <div className="relative aspect-[4/5] overflow-hidden bg-black">
                        <span className="absolute left-3 top-3 z-10 bg-bois px-2.5 py-1 text-[10px] font-medium uppercase tracking-widest text-white">
                          Après
                        </span>
                        <Image
                          src={item.afterImage}
                          alt={`${altBase} – après`}
                          title={imgTitle}
                          fill
                          sizes="(max-width: 768px) 50vw, 384px"
                          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                        />
                      </div>
                    </div>
                    <figcaption className="px-5 py-4">
                      <h2 className="font-montserrat text-sm font-semibold">{item.title}</h2>
                      {item.description && (
                        <p className="mt-1 text-xs leading-relaxed text-gray">{item.description}</p>
                      )}
                    </figcaption>
                  </figure>
                </div>
              );
            }

            // Photo simple — carte portrait 4/5, titre en overlay
            return (
              <figure
                key={item.id}
                className="group relative aspect-[4/5] overflow-hidden bg-black"
              >
                <Image
                  src={item.beforeImage}
                  alt={altBase}
                  title={imgTitle}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100" />
                <figcaption className="absolute inset-x-0 bottom-0 p-5">
                  <h2 className="font-montserrat text-sm font-semibold leading-snug text-white">
                    {item.title}
                  </h2>
                  {item.description && (
                    <p className="mt-1 text-xs leading-relaxed text-white/85 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      {item.description}
                    </p>
                  )}
                </figcaption>
              </figure>
            );
          })}
        </div>
      ) : (
        <p className="mt-16 text-center text-gray">La galerie sera bientôt alimentée.</p>
      )}

      {/* Social */}
      <div className="mt-20 border-t border-bois-light pt-12 text-center">
        <p className="text-sm text-gray">Suivez-nous pour plus de résultats</p>
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
