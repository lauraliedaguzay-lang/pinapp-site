'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const LINES = [
  'Avant que le jour ne nous appartienne.',
  'Trois moments. Trois fragrances.',
  'Une seule maison.',
] as const;

export function Scene3Manifesto() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const lineEls = [useRef<HTMLParagraphElement>(null), useRef<HTMLParagraphElement>(null), useRef<HTMLParagraphElement>(null)];

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      lineEls.forEach((r) => {
        if (r.current) gsap.set(r.current, { opacity: 1, y: 0 });
      });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrap,
          start: 'top top',
          end: '+=120%',
          pin: true,
          scrub: 0.6,
        },
      });

      lineEls.forEach((ref, i) => {
        const el = ref.current;
        if (!el) return;
        const a = i / 3;
        const b = (i + 0.28) / 3;
        tl.fromTo(el, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, ease: 'none' }, a);
        tl.to(el, { autoAlpha: 0, y: -12, ease: 'none' }, b);
      });
    }, wrap);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={wrapRef}
      id="manifesto"
      className="relative min-h-[100dvh] bg-noir-profond"
      aria-label="Manifeste"
    >
      <div
        className="flex min-h-[100dvh] flex-col items-center justify-center px-[6vw]"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(74, 31, 31, 0.28) 0%, transparent 68%)',
        }}
      >
        <p className="mb-12 font-body text-[0.7rem] font-extralight uppercase tracking-[0.5em] text-or-pur" style={{ fontWeight: 200 }}>
          — Manifeste
        </p>
        <div className="relative mx-auto min-h-[14rem] w-full max-w-[900px] text-center">
          {LINES.map((line, i) => (
            <p
              key={line}
              ref={lineEls[i]}
              className="absolute inset-x-0 top-0 font-display text-[clamp(1.75rem,4vw,3.5rem)] font-light italic leading-snug text-ivoire-chaud"
            >
              {line}
            </p>
          ))}
        </div>
        <div className="mx-auto mt-24 h-20 w-px bg-or-pur" aria-hidden />
      </div>
    </div>
  );
}
