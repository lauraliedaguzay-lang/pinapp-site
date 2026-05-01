'use client';

import { useEffect, useRef, useState } from 'react';

const TOTAL_MS = 2400;
const FADE_MS = 800;
const LABEL = 'MAISON ORIANE';

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
      const t = window.setTimeout(() => setPhase('fade'), 200);
      const t2 = window.setTimeout(() => setPhase('gone'), 200 + FADE_MS);
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
      className={`preloader fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-ivoire transition-[opacity,visibility] duration-1000 ease-out ${overlayClass}`}
      aria-hidden={phase === 'fade'}
      aria-busy={phase === 'run'}
    >
      <svg
        className="preloader-svg mb-8 h-28 w-20"
        viewBox="0 0 80 110"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <path
          className="liquid-fill"
          d="M 20 50 L 60 50 L 60 90 Q 60 95 55 95 L 25 95 Q 20 95 20 90 Z"
        />
        <path
          className="preloader-draw"
          d="M 20 50 L 60 50 L 60 90 Q 60 95 55 95 L 25 95 Q 20 95 20 90 Z"
        />
        <line className="preloader-draw" x1="32" y1="50" x2="32" y2="35" />
        <line className="preloader-draw" x1="48" y1="50" x2="48" y2="35" />
        <line className="preloader-draw" x1="28" y1="35" x2="52" y2="35" />
        <line className="preloader-draw" x1="28" y1="32" x2="52" y2="32" />
        <path
          className="preloader-draw"
          d="M 30 32 L 30 18 Q 30 15 33 15 L 47 15 Q 50 15 50 18 L 50 32"
        />
        <line className="preloader-draw" x1="25" y1="60" x2="25" y2="80" />
        <line className="preloader-draw" x1="55" y1="60" x2="55" y2="80" />
      </svg>

      <div className="preloader-text mb-2 flex overflow-hidden font-display text-2xl font-light italic tracking-[0.4em] text-encre">
        {Array.from(LABEL).map((char, i) => (
          <span
            key={i}
            className="preloader-letter inline-block"
            style={{
              animationDelay: reducedMotion.current
                ? '0s'
                : `${1.4 + i * 0.05}s`,
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </div>

      <div
        className="preloader-line mt-8 h-px w-[200px] origin-left scale-x-0 bg-or-rose"
        aria-hidden
      />

      <div
        className="mt-4 font-body text-[0.65rem] font-extralight tracking-[0.4em] text-or-rose"
        style={{ fontWeight: 200 }}
      >
        {String(percent).padStart(3, '0')}
      </div>
    </div>
  );
}
