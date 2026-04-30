import { useEffect, useState, type RefObject } from 'react';

/**
 * Progress 0–1 inside a tall section (sticky scroll storytelling).
 * Aligné BRIEF gallery : scrolled = -rect.top, total = offsetHeight - innerHeight.
 */
export function useSectionScrollProgress(
  sectionRef: RefObject<HTMLElement | null>,
): number {
  const [progress, setProgress] = useState(0);
  const rafRef = { current: null as number | null };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const tick = () => {
      rafRef.current = null;
      const el = sectionRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const total = Math.max(1, el.offsetHeight - window.innerHeight);
      const scrolled = -rect.top;
      const p = Math.max(0, Math.min(1, scrolled / total));
      setProgress(p);
    };

    const onScroll = () => {
      if (rafRef.current != null) return;
      rafRef.current = window.requestAnimationFrame(tick);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    tick();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafRef.current != null) window.cancelAnimationFrame(rafRef.current);
    };
  }, [sectionRef]);

  return progress;
}
