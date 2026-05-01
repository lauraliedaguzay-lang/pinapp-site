'use client';

import { useInView, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const LINES = [
  "Capturer l'instant où le monde change de couleur.",
  'Avant que le jour ne nous appartienne.',
  'Trois moments. Trois fragrances. Une seule maison.',
] as const;

export function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.4, once: true });
  const reducedMotion = useReducedMotion();

  const [line1, setLine1] = useState(false);
  const [line2, setLine2] = useState(false);
  const [line3, setLine3] = useState(false);
  const [divider, setDivider] = useState(false);

  useEffect(() => {
    if (!inView) return;

    const t0 = window.setTimeout(() => setLine1(true), 0);
    const t1 = window.setTimeout(() => setLine2(true), 500);
    const t2 = window.setTimeout(() => setLine3(true), 1000);
    const t3 = window.setTimeout(() => setDivider(true), 1500);

    return () => {
      window.clearTimeout(t0);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, [inView]);

  const lineMotion = reducedMotion
    ? 'transition-opacity duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)]'
    : 'transition-[opacity,transform] duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)]';

  const lineHidden = reducedMotion ? 'opacity-0' : 'translate-y-10 opacity-0';
  const lineShown = 'translate-y-0 opacity-100';

  const dividerMotion = reducedMotion
    ? 'transition-opacity duration-[1500ms] ease-out'
    : 'origin-top transition-transform duration-[1500ms] ease-out';

  return (
    <section
      ref={sectionRef}
      id="manifesto"
      className="relative flex min-h-[90vh] items-center overflow-hidden bg-noir-profond px-[6vw] py-[22vh] [clip-path:polygon(0_0,100%_0,100%_100%,0_95%)]"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(74, 31, 31, 0.3) 0%, transparent 70%)',
        }}
        aria-hidden
      />
      <div className="relative z-[10] mx-auto w-full max-w-[900px] text-center">
        <p
          className={`mb-16 font-body text-[0.7rem] font-extralight uppercase tracking-[0.5em] text-or-pur ${lineMotion} ${line1 ? lineShown : lineHidden}`}
          style={{ fontWeight: 200 }}
        >
          — Manifeste
        </p>

        <div className="space-y-6">
          <p
            className={`font-display text-[clamp(1.4rem,3vw,2.4rem)] font-light italic leading-[1.5] text-ivoire-chaud [text-shadow:0_0_30px_rgba(244,201,119,0.08)] ${lineMotion} ${line1 ? lineShown : lineHidden}`}
            style={{ fontWeight: 300 }}
          >
            {LINES[0]}
          </p>
          <p
            className={`font-display text-[clamp(1.4rem,3vw,2.4rem)] font-light italic leading-[1.5] text-ivoire-chaud [text-shadow:0_0_30px_rgba(244,201,119,0.08)] ${lineMotion} ${line2 ? lineShown : lineHidden}`}
            style={{ fontWeight: 300 }}
          >
            {LINES[1]}
          </p>
          <p
            className={`font-display text-[clamp(1.4rem,3vw,2.4rem)] font-light italic leading-[1.5] text-ivoire-chaud [text-shadow:0_0_30px_rgba(244,201,119,0.08)] ${lineMotion} ${line3 ? lineShown : lineHidden}`}
            style={{ fontWeight: 300 }}
          >
            {LINES[2]}
          </p>
        </div>

        <div
          className={`mx-auto mt-16 h-20 w-px bg-or-pur ${dividerMotion} ${
            reducedMotion
              ? divider
                ? 'opacity-100'
                : 'opacity-0'
              : divider
                ? 'scale-y-100 opacity-100'
                : 'scale-y-0 opacity-0'
          }`}
          aria-hidden
        />
      </div>
    </section>
  );
}
