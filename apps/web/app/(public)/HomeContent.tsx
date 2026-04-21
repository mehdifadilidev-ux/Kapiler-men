'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { apiClient } from '@/lib/api-client';
import { BOOKING_URL } from '@/lib/constants';
import type { Service, GalleryItem, NewsBanner } from '@kpil/shared';

export function HomeContent() {
  const [services, setServices] = useState<Service[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [banner, setBanner] = useState<NewsBanner | null>(null);

  useEffect(() => {
    apiClient.get<Service[]>('/services').then(setServices).catch(() => setServices([]));
    apiClient.get<GalleryItem[]>('/gallery').then(setGalleryItems).catch(() => setGalleryItems([]));
    apiClient.get<NewsBanner | null>('/news-banner').then(setBanner).catch(() => setBanner(null));
  }, []);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HairSalon',
    name: "KPIL'R Men",
    description: 'Prothesiste capillaire specialise dans les transformations naturelles pour homme. Institut prive a Orleans.',
    url: 'https://www.kpilrmen.fr',
    telephone: '+33666972562',
    email: 'kpilr-men@outlook.fr',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '64 Quai des Augustins',
      addressLocality: 'Orleans',
      postalCode: '45100',
      addressCountry: 'FR',
    },
    priceRange: '€€',
    sameAs: [
      'https://www.instagram.com/kpilr_men/',
      'https://www.tiktok.com/@kpilr_men',
    ],
    openingHoursSpecification: [
      { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Monday', opens: '09:30', closes: '19:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Tuesday', opens: '09:30', closes: '16:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Thursday', opens: '09:30', closes: '19:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Friday', opens: '09:30', closes: '19:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '09:00', closes: '18:00' },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main>
        {/* Banniere Actualites */}
        {banner && (
          <div className="bg-bois px-4 py-3 text-center text-sm text-white">
            {banner.link ? (
              <Link href={banner.link} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
                {banner.text}
              </Link>
            ) : (
              <span>{banner.text}</span>
            )}
          </div>
        )}

        {/* Hero */}
        <section className="flex min-h-[90vh] flex-col items-center justify-center px-6 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.5em] text-gray">
            Prothesiste capillaire
          </p>
          <h1 className="mt-6 font-montserrat text-5xl font-semibold tracking-tight md:text-7xl">
            KPIL&apos;R Men
          </h1>
          <p className="mt-6 max-w-lg font-bodoni text-xl italic text-gray">
            Envie de prendre soin de vous ? Besoin de retrouver confiance en vous ?
          </p>
          <p className="mt-4 max-w-lg text-sm text-gray">
            Vous etes au bon endroit. Nous proposons des solutions naturelles et sur mesure.
            KPIL&apos;R Men est un espace prive entierement dedie a l&apos;homme et a son image.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/presentation"
              className="border border-bois px-8 py-4 text-xs font-semibold uppercase tracking-widest text-bois transition-colors hover:bg-bois-light"
            >
              En savoir plus
            </Link>
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-bois px-8 py-4 text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:bg-bois/90"
            >
              Rendez-vous
            </a>
          </div>
        </section>

        {/* A propos */}
        <section className="bg-bois-light px-6 py-24">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-medium uppercase tracking-[0.5em] text-gray">A propos</p>
            <h2 className="mt-4 font-montserrat text-3xl font-semibold md:text-4xl">
              Un savoir-faire au service de votre image
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-gray">
              Specialise en prothese capillaire, nous vous accompagnons dans votre transformation avec
              des solutions naturelles et discretes. Chaque complement est adapte a votre morphologie,
              votre style et vos attentes pour un resultat invisible et naturel.
            </p>
          </div>
        </section>

        {/* Apercu soins */}
        <section className="px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <p className="text-xs font-medium uppercase tracking-[0.5em] text-gray">
                Nos soins
              </p>
              <h2 className="mt-4 font-montserrat text-3xl font-semibold md:text-4xl">
                Soins
              </h2>
            </div>

            <div className="mt-16 grid gap-8 md:grid-cols-3">
              {services.length > 0 ? (
                services.slice(0, 3).map((service) => (
                  <Link
                    key={service.id}
                    href="/soins"
                    className="group overflow-hidden border border-bois-light transition-colors hover:bg-bois-light"
                  >
                    {service.image && (
                      <div className="relative h-48 w-full">
                        <Image
                          src={service.image}
                          alt={service.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
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
                href="/soins"
                className="text-sm font-semibold text-bois underline underline-offset-4 transition-colors hover:text-bois/80"
              >
                Voir tous les soins
              </Link>
            </div>
          </div>
        </section>

        {/* Galerie */}
        <section className="bg-bois-light px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <p className="text-xs font-medium uppercase tracking-[0.5em] text-gray">Resultats</p>
              <h2 className="mt-4 font-montserrat text-3xl font-semibold md:text-4xl">
                Galerie
              </h2>
            </div>

            <div className="mt-16 grid gap-8 md:grid-cols-3">
              {galleryItems.length > 0 ? (
                galleryItems.slice(0, 3).map((item) => (
                  <div key={item.id} className="space-y-3 bg-white p-6">
                    {item.type === 'before_after' && item.afterImage ? (
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
                    ) : (
                      <Image
                        src={item.beforeImage}
                        alt={item.title}
                        width={400}
                        height={300}
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="aspect-[4/3] w-full rounded object-cover"
                      />
                    )}
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
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-block bg-bois px-10 py-4 text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:bg-bois/90"
          >
            Rendez-vous
          </a>
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
