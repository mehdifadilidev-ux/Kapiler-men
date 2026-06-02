'use client';

import { useOverflowScroll } from '@/lib/useOverflowScroll';
import type { Testimonial } from '@kpil/shared';

function TestimonialCard({ item }: { item: Testimonial }) {
  return (
    <div className="w-80 shrink-0 border border-bois-light p-8">
      <p className="font-montserrat text-sm font-semibold">{item.author}</p>
      <div className="mt-2 flex gap-0.5">
        {Array.from({ length: 5 }, (_, i) => (
          <span key={i} className={i < item.rating ? 'text-bois' : 'text-gray/30'}>
            &#9733;
          </span>
        ))}
        {item.source !== 'other' && (
          <span className="ml-2 text-xs text-gray">{item.source}</span>
        )}
      </div>
      <p className="mt-4 leading-relaxed text-gray">&laquo; {item.text} &raquo;</p>
    </div>
  );
}

export function TestimonialsMarquee({ testimonials }: { testimonials: Testimonial[] }) {
  const { containerRef, contentRef, shouldScroll } = useOverflowScroll(testimonials.length);

  return (
    <div ref={containerRef} className="overflow-hidden">
      <div
        ref={contentRef}
        className={
          shouldScroll ? 'animate-scroll-slow flex w-max gap-8' : 'flex justify-center gap-8'
        }
      >
        {testimonials.map((item) => (
          <TestimonialCard key={item.id} item={item} />
        ))}
        {shouldScroll &&
          testimonials.map((item) => <TestimonialCard key={`dup-${item.id}`} item={item} />)}
      </div>
    </div>
  );
}
