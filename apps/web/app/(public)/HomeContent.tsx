'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { apiClient } from '@/lib/api-client';
import { BOOKING_URL } from '@/lib/constants';
import { useOverflowScroll } from '@/lib/useOverflowScroll';
import type { Service, GalleryItem, NewsBanner, PartnerBrand } from '@kpil/shared';

export function HomeContent() {
  const [services, setServices] = useState<Service[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [banner, setBanner] = useState<NewsBanner | null>(null);
  const [brands, setBrands] = useState<PartnerBrand[]>([]);

  useEffect(() => {
    apiClient.get<Service[]>('/services').then(setServices).catch(() => setServices([]));
    apiClient.get<GalleryItem[]>('/gallery').then(setGalleryItems).catch(() => setGalleryItems([]));
    apiClient.get<NewsBanner | null>('/news-banner').then(setBanner).catch(() => setBanner(null));
    apiClient.get<PartnerBrand[]>('/partner-brands').then(setBrands).catch(() => setBrands([]));
  }, []);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HairSalon',
    name: "KPIL'R Men",
    description: 'Prothésiste capillaire spécialisé dans les transformations naturelles pour homme. Institut privé à Orléans.',
    url: 'https://kpilr-men.fr',
    telephone: '+33666972562',
    email: 'kpilr-men@outlook.fr',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '64 Quai des Augustins',
      addressLocality: 'Orléans',
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
        <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-6 text-center">
          {/* Background */}
          <Image
            src="/assets/hero-institut.jpg"
            alt="Interieur de l'institut KPIL'R Men a Orleans"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/30 to-black/60" />

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center">
            <p className="text-xs font-medium uppercase tracking-[0.5em] text-white/70">
              Prothésiste capillaire
            </p>
            <h1 className="mt-6 font-montserrat text-5xl font-semibold tracking-tight text-white md:text-7xl">
              KPIL&apos;R Men
            </h1>
            <p className="mt-6 max-w-lg font-bodoni text-xl italic text-white/90">
              Envie de prendre soin de vous ? Besoin de retrouver confiance en vous ?
            </p>
            <p className="mt-4 max-w-lg text-sm text-white/80">
              Vous êtes au bon endroit. Nous proposons des solutions naturelles et sur mesure.
              KPIL&apos;R Men est un espace privé entièrement dédié à l&apos;homme et à son image.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                href="/presentation"
                className="border border-white px-8 py-4 text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:bg-white hover:text-black"
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
          </div>

          <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-white/80">
            <span className="animate-scroll-hint text-xs uppercase tracking-[0.4em]">Découvrir</span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="h-5 w-5 animate-scroll-hint"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </section>

        {/* A propos */}
        <section className="bg-bois-light px-6 py-24">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-medium uppercase tracking-[0.5em] text-gray">À propos</p>
            <h2 className="mt-4 font-montserrat text-3xl font-semibold md:text-4xl">
              Un savoir-faire au service de votre image
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-gray">
              Spécialisé en prothèse capillaire, nous vous accompagnons dans votre transformation avec
              des solutions naturelles et discrètes. Chaque complément est adapté à votre morphologie,
              votre style et vos attentes pour un résultat invisible et naturel.
            </p>
          </div>
        </section>

        {/* Apercu soins */}
        {services.length > 0 && (
          <section className="px-6 py-24">
            <div className="mx-auto max-w-6xl">
              <div className="text-center">
                <p className="text-xs font-medium uppercase tracking-[0.5em] text-gray">
                  Nos prestations
                </p>
                <h2 className="mt-4 font-montserrat text-3xl font-semibold md:text-4xl">
                  Prestations
                </h2>
              </div>

              <div className="mt-16 grid gap-8 md:grid-cols-3">
                {services.slice(0, 3).map((service) => (
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
                ))}
              </div>

              <div className="mt-12 text-center">
                <Link
                  href="/soins"
                  className="text-sm font-semibold text-bois underline underline-offset-4 transition-colors hover:text-bois/80"
                >
                  Voir toutes les prestations
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Galerie */}
        {galleryItems.length > 0 && (
          <section className="bg-bois-light px-6 py-24">
            <div className="mx-auto max-w-6xl">
              <div className="text-center">
                <p className="text-xs font-medium uppercase tracking-[0.5em] text-gray">Résultats</p>
                <h2 className="mt-4 font-montserrat text-3xl font-semibold md:text-4xl">
                  Galerie
                </h2>
              </div>

              <div className="mt-16 grid gap-8 md:grid-cols-3">
                {galleryItems.slice(0, 3).map((item) => (
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
                          alt={`${item.title} - après`}
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
                ))}
              </div>

              <div className="mt-12 text-center">
                <Link
                  href="/galerie"
                  className="text-sm font-semibold text-bois underline underline-offset-4 transition-colors hover:text-bois/80"
                >
                  Voir la galerie complète
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Marques partenaires */}
        {brands.length > 0 && (
          <section className="px-6 py-24">
            <div className="mx-auto max-w-6xl">
              <div className="text-center">
                <p className="text-xs font-medium uppercase tracking-[0.5em] text-gray">
                  Nos partenaires
                </p>
                <h2 className="mt-4 font-montserrat text-3xl font-semibold md:text-4xl">
                  Marques partenaires
                </h2>
              </div>

              <PartnerBrandsRow brands={brands} />
            </div>
          </section>
        )}

        {/* CTA Final */}
        <section className="bg-black px-6 py-24 text-center text-white">
          <p className="text-xs font-medium uppercase tracking-[0.5em] text-gray">
            Prêt à changer ?
          </p>
          <h2 className="mt-4 font-montserrat text-3xl font-semibold md:text-4xl">
            Prenez rendez-vous dès maintenant
          </h2>
          <p className="mt-4 text-gray">
            Consultation personnalisée pour définir la solution idéale.
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

function PartnerBrandsRow({ brands }: { brands: PartnerBrand[] }) {
  const { containerRef, contentRef, shouldScroll } = useOverflowScroll(brands.length);

  return (
    <div ref={containerRef} className="mt-16 overflow-hidden">
      <div
        ref={contentRef}
        className={
          shouldScroll
            ? 'animate-scroll flex w-max items-start gap-16'
            : 'flex items-start justify-center gap-16'
        }
      >
        {brands.map((brand) => (
          <PartnerBrandLogo key={brand.id} brand={brand} />
        ))}
        {shouldScroll &&
          brands.map((brand) => (
            <PartnerBrandLogo key={`dup-${brand.id}`} brand={brand} />
          ))}
      </div>
    </div>
  );
}

function PartnerBrandLogo({ brand }: { brand: PartnerBrand }) {
  const content = (
    <div className="group flex flex-col items-center gap-3">
      <div className="relative h-20 w-40 grayscale transition-all duration-300 group-hover:grayscale-0">
        <Image
          src={brand.logo}
          alt={brand.name}
          fill
          sizes="160px"
          className="object-contain"
        />
      </div>
      <p className="text-center text-xs font-medium uppercase tracking-widest text-gray">
        {brand.name}
      </p>
    </div>
  );

  if (brand.website) {
    return (
      <Link
        href={brand.website}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={brand.name}
        className="shrink-0"
      >
        {content}
      </Link>
    );
  }

  return <div className="shrink-0">{content}</div>;
}

