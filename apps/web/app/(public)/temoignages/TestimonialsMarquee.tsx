'use client';

import { useOverflowScroll } from '@/lib/useOverflowScroll';
import type { Testimonial } from '@kpil/shared';

function TestimonialCard({ item, compact }: { item: Testimonial; compact?: boolean | undefined }) {
  return (
    <div
      className={`shrink-0 border border-bois-light ${compact ? 'w-72 p-6' : 'w-80 p-8'}`}
    >
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
      <p className={`mt-4 leading-relaxed text-gray ${compact ? 'text-sm line-clamp-6' : ''}`}>
        &laquo; {item.text} &raquo;
      </p>
    </div>
  );
}

interface TestimonialsMarqueeProps {
  testimonials: Testimonial[];
  /** Compact preview cards (clamped text) — used on the home page. */
  compact?: boolean | undefined;
}

export function TestimonialsMarquee({ testimonials, compact }: TestimonialsMarqueeProps) {
  const { containerRef, contentRef, shouldScroll } = useOverflowScroll(testimonials.length);

  return (
    <div ref={containerRef} className="overflow-hidden">
      <div
        ref={contentRef}
        className={
          shouldScroll
            ? 'animate-scroll-slow flex w-max items-stretch gap-8'
            : 'flex items-stretch justify-center gap-8'
        }
      >
        {testimonials.map((item) => (
          <TestimonialCard key={item.id} item={item} compact={compact} />
        ))}
        {shouldScroll &&
          testimonials.map((item) => (
            <TestimonialCard key={`dup-${item.id}`} item={item} compact={compact} />
          ))}
      </div>
    </div>
  );
}
