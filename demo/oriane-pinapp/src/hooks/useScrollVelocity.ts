import { useEffect, useRef, type MutableRefObject } from 'react';

/**
 * Vitesse de scroll lissée (signée), mise à jour sans re-render du parent.
 * Lire `ref.current` dans useFrame ou requestAnimationFrame.
 */
export function useScrollVelocityRef(): MutableRefObject<number> {
  const velocityRef = useRef(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let lastY = window.scrollY;
    let lastT = performance.now();
    let smooth = 0;
    let raf = 0;

    const onScroll = () => {
      const now = performance.now();
      const y = window.scrollY;
      const dy = y - lastY;
      const dt = Math.max(1, now - lastT);
      const inst = (dy / dt) * 12;
      smooth += (inst - smooth) * 0.35;
      lastY = y;
      lastT = now;
    };

    const tick = () => {
      smooth *= 0.94;
      velocityRef.current = smooth;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return velocityRef;
}
