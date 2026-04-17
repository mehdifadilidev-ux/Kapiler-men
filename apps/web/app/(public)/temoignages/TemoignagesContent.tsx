'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import type { Testimonial } from '@kpil/shared';

export function TemoignagesContent() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get<Testimonial[]>('/testimonials')
      .then(setTestimonials)
      .catch(() => setTestimonials([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="px-6 py-24">
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-xs font-medium uppercase tracking-[0.5em] text-gray">Temoignages</p>
        <h1 className="mt-6 font-montserrat text-4xl font-semibold md:text-5xl">
          Ils nous ont fait confiance
        </h1>
        <p className="mt-6 font-bodoni text-xl italic text-gray">
          Decouvrez les avis de nos clients.
        </p>
      </div>

      <section className="mx-auto mt-16 max-w-4xl">
        {loading ? (
          <p className="text-center text-gray">Chargement...</p>
        ) : testimonials.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2">
            {testimonials.map((item) => (
              <div key={item.id} className="border border-bois-light p-8">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }, (_, i) => (
                    <span
                      key={i}
                      className={i < item.rating ? 'text-bois' : 'text-gray/30'}
                    >
                      &#9733;
                    </span>
                  ))}
                </div>
                <p className="mt-4 leading-relaxed text-gray">
                  &laquo; {item.text} &raquo;
                </p>
                <div className="mt-6 flex items-center justify-between">
                  <p className="font-montserrat text-sm font-semibold">{item.author}</p>
                  <span className="text-xs text-gray">{item.source === 'other' ? '' : item.source}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray">Les temoignages seront bientot disponibles.</p>
        )}
      </section>
    </main>
  );
}
