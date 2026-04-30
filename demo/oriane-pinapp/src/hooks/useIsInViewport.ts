import { useEffect, useState, type RefObject } from 'react';

export type UseIsInViewportOptions = {
  threshold?: number;
  rootMargin?: string;
  /**
   * true = visible jusqu’au premier callback IO (hero au first paint).
   * false = hors viewport jusqu’à intersection (contact, galerie loin du fold).
   */
  initialInViewport?: boolean;
};

export function useIsInViewport(
  ref: RefObject<HTMLElement | null>,
  {
    threshold = 0.1,
    rootMargin = '100px',
    initialInViewport = true,
  }: UseIsInViewportOptions = {},
): boolean {
  const [isInViewport, setIsInViewport] = useState(initialInViewport);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setIsInViewport(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInViewport(entry.isIntersecting);
      },
      { threshold, rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, threshold, rootMargin]);

  return isInViewport;
}
