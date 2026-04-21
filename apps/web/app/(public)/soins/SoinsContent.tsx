'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { apiClient } from '@/lib/api-client';
import { BOOKING_URL } from '@/lib/constants';
import type { Service } from '@kpil/shared';

export function SoinsContent() {
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
      {/* Intro */}
      <section className="mx-auto max-w-4xl text-center">
        <p className="text-xs font-medium uppercase tracking-[0.5em] text-gray">Soins</p>
        <h1 className="mt-6 font-montserrat text-4xl font-semibold md:text-5xl">
          L&apos;experience KPIL&apos;R MEN
        </h1>
        <p className="mt-6 font-bodoni text-xl italic text-gray">
          Chaque rendez-vous est concu comme un moment privilegie.
        </p>
        <p className="mt-4 leading-relaxed text-gray">
          Le fonctionnement de l&apos;institut repose sur un principe simple : prendre le temps
          necessaire pour chaque client, dans un environnement calme et discret.
          Un accompagnement sur mesure, respectueux des attentes et du rythme de chacun.
        </p>
      </section>

      {/* Specialite */}
      <section className="mx-auto mt-20 max-w-4xl">
        <h2 className="font-montserrat text-2xl font-semibold">
          Specialite : la prothese capillaire
        </h2>
        <p className="mt-6 leading-relaxed text-gray">
          La prothese capillaire permet d&apos;apporter une solution esthetique naturelle face aux
          problematiques de perte ou de rarefaction des cheveux.
        </p>
        <p className="mt-4 leading-relaxed text-gray">
          Chaque projet est etudie individuellement afin de determiner :
        </p>
        <ul className="mt-6 space-y-3 text-gray">
          <li className="flex items-start gap-3">
            <span className="mt-1 text-bois">&#10003;</span>
            <span>La typologie de complement capillaire</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 text-bois">&#10003;</span>
            <span>La densite et la texture adaptees</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 text-bois">&#10003;</span>
            <span>La couleur la plus naturelle</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 text-bois">&#10003;</span>
            <span>La technique de fixation la plus appropriee</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 text-bois">&#10003;</span>
            <span>Le budget disponible</span>
          </li>
        </ul>
        <p className="mt-6 leading-relaxed text-gray">
          L&apos;objectif est d&apos;obtenir un resultat discret, harmonieux et confortable au
          quotidien.
        </p>
      </section>

      {/* Approche personnalisee */}
      <section className="mt-20 bg-bois-light px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-montserrat text-2xl font-semibold">Une approche personnalisee</h2>
          <p className="mt-6 leading-relaxed text-gray">
            Chaque client beneficie d&apos;un accompagnement base sur :
          </p>
          <ul className="mt-6 space-y-3 text-gray">
            <li className="flex items-start gap-3">
              <span className="mt-1 text-bois">&#10003;</span>
              <span>L&apos;ecoute</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 text-bois">&#10003;</span>
              <span>Le conseil</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 text-bois">&#10003;</span>
              <span>L&apos;expertise technique</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 text-bois">&#10003;</span>
              <span>La discretion</span>
            </li>
          </ul>
          <p className="mt-6 leading-relaxed text-gray">
            Afin de proposer la solution la plus adaptee a chaque situation, tout accompagnement
            commence par un rendez-vous diagnostic.
          </p>
        </div>
      </section>

      {/* Conditions */}
      <section className="mx-auto mt-20 max-w-4xl">
        <h2 className="font-montserrat text-2xl font-semibold">Conditions</h2>
        <div className="mt-6 space-y-4 leading-relaxed text-gray">
          <p>Diagnostic obligatoire avant toute validation de transformation capillaire.</p>
          <p>
            Les tarifs peuvent etre ajustes selon la typologie de prothese capillaire selectionnee.
          </p>
          <p>Un acompte de 150 &euro; est demande pour toute transformation capillaire.</p>
          <p>
            La commande de la prothese est effectuee apres validation du devis et encaissement de
            l&apos;acompte.
          </p>
          <p>
            Cet acompte confirme la commande et ne pourra etre rembourse apres validation du devis
            et lancement de la commande.
          </p>
          <p className="text-sm italic">
            Aucune TVA applicable &ndash; Article 293 B du CGI
          </p>
        </div>
      </section>

      {/* Liste des soins */}
      <section className="mx-auto mt-20 max-w-5xl">
        <h2 className="mb-12 text-center font-montserrat text-2xl font-semibold">Nos prestations</h2>
        {loading ? (
          <p className="text-gray">Chargement...</p>
        ) : services.length > 0 ? (
          groupBySection(services).map(([sectionName, sectionServices]) => (
            <div key={sectionName || 'autres'} className="mt-16 first:mt-0">
              {sectionName && (
                <div className="mb-8">
                  <span className="block h-0.5 w-12 bg-bois" />
                  <h3 className="mt-4 font-montserrat text-xl font-semibold">{sectionName}</h3>
                </div>
              )}
              <div className="space-y-10">
                {sectionServices.map((service) =>
                  service.image ? (
              <div
                key={service.id}
                className="overflow-hidden border border-bois-light md:flex"
              >
                <div className="relative h-64 md:h-auto md:w-80">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 320px"
                    className="object-cover"
                  />
                </div>

                <div className="flex min-w-0 flex-1 flex-col justify-between p-8">
                  <div className="min-w-0 break-words">
                    <h2 className="font-montserrat text-2xl font-semibold">{service.title}</h2>

                    {(service.price || service.duration) && (
                      <div className="mt-3 inline-flex items-center gap-2 bg-bois-light px-3 py-1 text-sm text-bois">
                        {service.price && <span>{service.price} &euro;</span>}
                        {service.price && service.duration && <span className="opacity-50">|</span>}
                        {service.duration && <span>{service.duration}</span>}
                      </div>
                    )}

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

                    {service.description && (
                      <p className="mt-4 text-xs italic leading-relaxed text-gray">
                        {service.description}
                      </p>
                    )}
                  </div>

                  <div className="mt-8 flex justify-end">
                    <a
                      href={BOOKING_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-bois px-6 py-3 text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:bg-bois/90"
                    >
                      Prendre rendez-vous
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div key={service.id} className="border-l-2 border-bois-light pl-6">
                <h3 className="font-montserrat text-lg font-semibold text-bois">{service.title}</h3>

                {(service.price || service.duration) && (
                  <div className="mt-2 inline-flex items-center gap-2 bg-bois-light px-3 py-1 text-sm text-bois">
                    {service.price && <span>{service.price} &euro;</span>}
                    {service.price && service.duration && <span className="opacity-50">|</span>}
                    {service.duration && <span>{service.duration}</span>}
                  </div>
                )}

                {service.features.length > 0 && (
                  <ul className="mt-4 space-y-1.5 text-sm text-black">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex gap-2">
                        <span className="text-bois">&bull;</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {service.description && (
                  <p className="mt-3 text-xs italic leading-relaxed text-gray">
                    {service.description}
                  </p>
                )}
              </div>
            ),
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray">Les soins seront bientot disponibles.</p>
        )}
      </section>

      {/* CTA */}
      <section className="mt-20 text-center">
        <a
          href={BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-bois px-10 py-4 text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:bg-bois/90"
        >
          Prendre rendez-vous
        </a>
      </section>
    </main>
  );
}

function groupBySection(services: Service[]): [string, Service[]][] {
  const groups = new Map<string, Service[]>();
  for (const service of services) {
    const key = service.section?.trim() ?? '';
    const existing = groups.get(key);
    if (existing) {
      existing.push(service);
    } else {
      groups.set(key, [service]);
    }
  }
  const unsectioned = groups.get('');
  groups.delete('');
  const result: [string, Service[]][] = unsectioned ? [['', unsectioned]] : [];
  for (const entry of groups) result.push(entry);
  return result;
}
