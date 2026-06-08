import { useEffect, useRef } from 'react';

export function useSectionImpression<T extends HTMLElement>(
  onImpression: () => void,
  options: IntersectionObserverInit = { threshold: 0.4 },
) {
  const ref = useRef<T | null>(null);
  const fired = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || fired.current) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !fired.current) {
          fired.current = true;
          onImpression();
          observer.disconnect();
        }
      });
    }, options);
    observer.observe(el);
    return () => observer.disconnect();
  }, [onImpression, options]);

  return ref;
}
