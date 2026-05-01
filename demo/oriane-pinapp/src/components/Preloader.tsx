'use client';

import { useEffect, useRef, useState } from 'react';

const TOTAL_MS = 1200;
const FADE_MS = 300;
const LABEL = 'M·O';

export function Preloader() {
  const [phase, setPhase] = useState<'run' | 'fade' | 'gone'>('run');
  const [percent, setPercent] = useState(0);
  const reducedMotion = useRef(false);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef(0);

  useEffect(() => {
    reducedMotion.current =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion.current) {
      setPercent(100);
      const t = window.setTimeout(() => setPhase('fade'), 150);
      const t2 = window.setTimeout(() => setPhase('gone'), 150 + FADE_MS);
      return () => {
        window.clearTimeout(t);
        window.clearTimeout(t2);
      };
    }

    startRef.current = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startRef.current;
      const p = Math.min(100, Math.round((elapsed / TOTAL_MS) * 100));
      setPercent(p);

      if (elapsed < TOTAL_MS) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setPercent(100);
        setPhase('fade');
        window.setTimeout(() => setPhase('gone'), FADE_MS);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  if (phase === 'gone') return null;

  const overlayClass =
    phase === 'fade'
      ? 'pointer-events-none opacity-0 invisible'
      : 'opacity-100 visible';

  return (
    <div
      className={`preloader fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-ivoire transition-[opacity,visibility] duration-300 ease-out ${overlayClass}`}
      aria-hidden={phase === 'fade'}
      aria-busy={phase === 'run'}
    >
      <div className="mb-10 font-display text-3xl font-light italic tracking-[0.35em] text-encre md:text-4xl">
        {LABEL}
      </div>

      <div
        className="preloader-line h-px w-[min(200px,40vw)] origin-left scale-x-0 bg-or-rose"
        aria-hidden
      />

      <div
        className="mt-6 font-body text-[0.65rem] font-extralight tracking-[0.35em] text-or-rose"
        style={{ fontWeight: 200 }}
      >
        {String(percent).padStart(3, '0')}
      </div>
    </div>
  );
}
