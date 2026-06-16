'use client';

import { useEffect, useRef } from 'react';

const INTERACTIVE_SELECTOR =
  'a[href], button, .photo-3d-wrap, .contact-button, #collection article';

export function LosangeCursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const lerpX = useRef(0);
  const lerpY = useRef(0);
  const rotation = useRef(0);
  const hoveredRef = useRef(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const mq = window.matchMedia('(min-width: 768px)');
    lerpX.current = window.innerWidth / 2;
    lerpY.current = window.innerHeight / 2;
    mouseX.current = lerpX.current;
    mouseY.current = lerpY.current;

    const onMove = (e: MouseEvent) => {
      mouseX.current = e.clientX;
      mouseY.current = e.clientY;

      if (!mq.matches) return;
      const under = document.elementFromPoint(e.clientX, e.clientY);
      hoveredRef.current = !!(
        under instanceof Element && under.closest(INTERACTIVE_SELECTOR)
      );
    };

    const tick = () => {
      if (!mq.matches) {
        rafRef.current = null;
        return;
      }

      lerpX.current += (mouseX.current - lerpX.current) * 0.12;
      lerpY.current += (mouseY.current - lerpY.current) * 0.12;
      rotation.current += 1;

      const el = rootRef.current;
      if (el) {
        const s = hoveredRef.current ? 2.2 : 1;
        el.style.transform = `translate(${lerpX.current}px, ${lerpY.current}px) translate(-50%, -50%) rotate(${rotation.current}deg) scale(${s})`;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    const start = () => {
      window.addEventListener('mousemove', onMove, { passive: true });
      if (rafRef.current == null) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    const stop = () => {
      window.removeEventListener('mousemove', onMove);
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };

    const onMq = () => {
      if (mq.matches) start();
      else stop();
    };

    mq.addEventListener('change', onMq);
    if (mq.matches) start();

    return () => {
      mq.removeEventListener('change', onMq);
      stop();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="losange-cursor pointer-events-none fixed left-0 top-0 z-[9998] hidden mix-blend-difference md:block"
      aria-hidden
    >
      <span className="losange-square losange-outer" />
      <span className="losange-square losange-inner" />
    </div>
  );
}
