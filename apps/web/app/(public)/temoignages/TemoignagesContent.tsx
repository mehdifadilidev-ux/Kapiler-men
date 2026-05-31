import { z } from 'zod';
import { testimonialSchema, type Testimonial } from '@kpil/shared';
import { TestimonialsMarquee } from './TestimonialsMarquee';

const testimonialsArraySchema = z.array(testimonialSchema);

async function fetchTestimonials(): Promise<Testimonial[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!baseUrl) return [];
  try {
    const res = await fetch(`${baseUrl}/testimonials`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    return testimonialsArraySchema.parse(await res.json());
  } catch {
    return [];
  }
}

export async function TemoignagesContent() {
  const testimonials = await fetchTestimonials();

  return (
    <main className="px-6 py-24">
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-xs font-medium uppercase tracking-[0.5em] text-gray">Témoignages</p>
        <h1 className="mt-6 font-montserrat text-4xl font-semibold md:text-5xl">
          Ils nous ont fait confiance
        </h1>
        <p className="mt-6 font-bodoni text-xl italic text-gray">
          Découvrez les avis de nos clients.
        </p>
      </div>

      <section className="mt-16">
        {testimonials.length > 0 ? (
          <TestimonialsMarquee testimonials={testimonials} />
        ) : (
          <p className="text-center text-gray">Les témoignages seront bientôt disponibles.</p>
        )}
      </section>
    </main>
  );
}
