import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { fetchApi } from '@/lib/fetcher';
import type { Service, GalleryItem } from '@kpil/shared';

export const metadata: Metadata = {
  title: 'KPIL R Men — Prothesiste capillaire',
  description:
    'Prothesiste capillaire specialise dans les transformations naturelles. Complements capillaires sur mesure, resultats garantis.',
};

export default async function HomePage() {
  const [servicesData, galleryData] = await Promise.all([
    fetchApi<Service[]>('/api/services'),
    fetchApi<GalleryItem[]>('/api/gallery'),
  ]);
  const services = servicesData ?? [];
  const galleryItems = galleryData ?? [];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'KPIL R Men',
    description: 'Prothesiste capillaire specialise dans les transformations naturelles.',
    url: 'https://www.kpilrmen.fr',
    priceRange: '€€',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main>
        {/* Hero */}
        <section className="flex min-h-[90vh] flex-col items-center justify-center px-6 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.5em] text-gray">
            Prothesiste capillaire
          </p>
          <h1 className="mt-6 font-montserrat text-5xl font-semibold tracking-tight md:text-7xl">
            KPIL R Men
          </h1>
          <p className="mt-6 max-w-lg font-bodoni text-xl italic text-gray">
            Des transformations naturelles et sur mesure pour retrouver confiance en soi.
          </p>
          <Link
            href="/reserver"
            className="mt-10 bg-bois px-8 py-4 text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:bg-bois/90"
          >
            Prendre rendez-vous
          </Link>
        </section>

        {/* A propos */}
        <section className="bg-bois-light px-6 py-24">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-medium uppercase tracking-[0.5em] text-gray">A propos</p>
            <h2 className="mt-4 font-montserrat text-3xl font-semibold md:text-4xl">
              Un savoir-faire au service de votre image
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-gray">
              Specialise en prothese capillaire, je vous accompagne dans votre transformation avec
              des solutions naturelles et discretes. Chaque complement est adapte a votre morphologie,
              votre style et vos attentes pour un resultat invisible et naturel.
            </p>
          </div>
        </section>

        {/* Prestations */}
        <section className="px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <p className="text-xs font-medium uppercase tracking-[0.5em] text-gray">
                Nos services
              </p>
              <h2 className="mt-4 font-montserrat text-3xl font-semibold md:text-4xl">
                Prestations
              </h2>
            </div>

            <div className="mt-16 grid gap-8 md:grid-cols-3">
              {services.length > 0 ? (
                services.slice(0, 3).map((service) => (
                  <Link
                    key={service.id}
                    href="/prestations"
                    className="group overflow-hidden border border-bois-light transition-colors hover:bg-bois-light"
                  >
                    {service.image ? (
                      <div className="relative h-48 w-full">
                        <Image
                          src={service.image}
                          alt={service.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                    ) : (
                      <div className="h-48 w-full bg-bois-light" />
                    )}
                    <div className="p-6 text-center">
                      <h3 className="font-montserrat text-lg font-semibold">{service.title}</h3>
                      {service.features.length > 0 && (
                        <p className="mt-2 text-xs text-gray">
                          {service.features.slice(0, 2).join(' · ')}
                          {service.features.length > 2 && ' …'}
                        </p>
                      )}
                      {service.price && (
                        <p className="mt-3 font-semibold text-bois">{service.price} &euro;</p>
                      )}
                    </div>
                  </Link>
                ))
              ) : (
                <>
                  <PlaceholderCard title="Transformation Essentielle" />
                  <PlaceholderCard title="Transformation Signature" />
                  <PlaceholderCard title="Entretien & Suivi" />
                </>
              )}
            </div>

            <div className="mt-12 text-center">
              <Link
                href="/prestations"
                className="text-sm font-semibold text-bois underline underline-offset-4 transition-colors hover:text-bois/80"
              >
                Voir toutes les prestations
              </Link>
            </div>
          </div>
        </section>

        {/* Galerie avant/apres */}
        <section className="bg-bois-light px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <p className="text-xs font-medium uppercase tracking-[0.5em] text-gray">Resultats</p>
              <h2 className="mt-4 font-montserrat text-3xl font-semibold md:text-4xl">
                Avant / Apres
              </h2>
            </div>

            <div className="mt-16 grid gap-8 md:grid-cols-3">
              {galleryItems.length > 0 ? (
                galleryItems.slice(0, 3).map((item) => (
                  <div key={item.id} className="space-y-3 bg-white p-6">
                    <div className="grid grid-cols-2 gap-3">
                      <Image
                        src={item.beforeImage}
                        alt={`${item.title} - avant`}
                        width={400}
                        height={300}
                        sizes="(max-width: 768px) 50vw, 16vw"
                        className="aspect-[4/3] w-full rounded object-cover"
                      />
                      <Image
                        src={item.afterImage}
                        alt={`${item.title} - apres`}
                        width={400}
                        height={300}
                        sizes="(max-width: 768px) 50vw, 16vw"
                        className="aspect-[4/3] w-full rounded object-cover"
                      />
                    </div>
                    <p className="text-center font-montserrat text-sm font-semibold">
                      {item.title}
                    </p>
                  </div>
                ))
              ) : (
                <>
                  <GalleryPlaceholder />
                  <GalleryPlaceholder />
                  <GalleryPlaceholder />
                </>
              )}
            </div>

            <div className="mt-12 text-center">
              <Link
                href="/galerie"
                className="text-sm font-semibold text-bois underline underline-offset-4 transition-colors hover:text-bois/80"
              >
                Voir la galerie complete
              </Link>
            </div>
          </div>
        </section>

        {/* Temoignages */}
        <section className="px-6 py-24">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-medium uppercase tracking-[0.5em] text-gray">Temoignages</p>
            <h2 className="mt-4 font-montserrat text-3xl font-semibold md:text-4xl">
              Ce que disent nos clients
            </h2>

            <div className="mt-16 grid gap-8 md:grid-cols-2">
              <TestimonialCard
                quote="Un resultat bluffant et naturel. Personne ne remarque quoi que ce soit."
                author="Thomas M."
              />
              <TestimonialCard
                quote="Professionnel, a l'ecoute, et un travail vraiment impeccable. Je recommande a 100%."
                author="David L."
              />
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="bg-black px-6 py-24 text-center text-white">
          <p className="text-xs font-medium uppercase tracking-[0.5em] text-gray">
            Pret a changer ?
          </p>
          <h2 className="mt-4 font-montserrat text-3xl font-semibold md:text-4xl">
            Prenez rendez-vous des maintenant
          </h2>
          <p className="mt-4 text-gray">
            Consultation personnalisee pour definir la solution ideale.
          </p>
          <Link
            href="/reserver"
            className="mt-10 inline-block bg-bois px-10 py-4 text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:bg-bois/90"
          >
            Reserver
          </Link>
        </section>
      </main>
    </>
  );
}

function PlaceholderCard({ title }: { title: string }) {
  return (
    <div className="border border-bois-light p-8 text-center">
      <h3 className="font-montserrat text-lg font-semibold">{title}</h3>
      <p className="mt-3 text-sm text-gray">Details bientot disponibles.</p>
    </div>
  );
}

function GalleryPlaceholder() {
  return (
    <div className="space-y-3 bg-white p-6">
      <div className="grid grid-cols-2 gap-3">
        <div className="aspect-[4/3] bg-bois-light" />
        <div className="aspect-[4/3] bg-bois-light" />
      </div>
      <p className="text-center text-sm text-gray">Avant / Apres</p>
    </div>
  );
}

function TestimonialCard({ quote, author }: { quote: string; author: string }) {
  return (
    <div className="border border-bois-light p-8">
      <p className="font-bodoni text-lg italic leading-relaxed text-gray">
        &laquo; {quote} &raquo;
      </p>
      <p className="mt-4 text-sm font-semibold">{author}</p>
    </div>
  );
}
