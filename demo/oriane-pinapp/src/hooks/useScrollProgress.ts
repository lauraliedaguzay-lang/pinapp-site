import { useEffect, useState, useRef } from 'react';

/** Court : 0–1 sur ~1 viewport (Marco). */
export function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const update = () => {
      rafRef.current = null;
      const p = Math.min(1, Math.max(0, window.scrollY / window.innerHeight));
      setProgress(p);
    };

    const onScroll = () => {
      if (rafRef.current != null) return;
      rafRef.current = window.requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    update();

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafRef.current != null) window.cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return progress;
}
