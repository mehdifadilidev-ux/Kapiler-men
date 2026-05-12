import { useEffect, useRef, useState } from 'react';

export function useOverflowScroll(itemCount: number) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [shouldScroll, setShouldScroll] = useState(false);
  const shouldScrollRef = useRef(false);

  useEffect(() => {
    shouldScrollRef.current = shouldScroll;
  }, [shouldScroll]);

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    const measure = () => {
      const factor = shouldScrollRef.current ? 2 : 1;
      const naturalWidth = content.scrollWidth / factor;
      setShouldScroll(naturalWidth > container.clientWidth + 1);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(container);
    return () => ro.disconnect();
  }, [itemCount]);

  return { containerRef, contentRef, shouldScroll };
}
