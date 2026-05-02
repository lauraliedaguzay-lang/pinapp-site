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
  const lineEls = [
    useRef<HTMLParagraphElement>(null),
    useRef<HTMLParagraphElement>(null),
    useRef<HTMLParagraphElement>(null),
  ];
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      lineEls.forEach((r) => {
        if (r.current) gsap.set(r.current, { opacity: 1, y: 0 });
      });
      if (lineRef.current) gsap.set(lineRef.current, { scaleY: 1 });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrap,
          start: 'top top',
          end: '+=150%',
          pin: true,
          scrub: 0.7,
        },
      });

      // Chaque ligne : fade-in puis fade-out rapide
      lineEls.forEach((ref, i) => {
        const el = ref.current;
        if (!el) return;
        const a = (i * 0.28);
        const peak = a + 0.16;
        const b = peak + 0.1;
        tl.fromTo(el, { autoAlpha: 0, y: 24, filter: 'blur(6px)' }, { autoAlpha: 1, y: 0, filter: 'blur(0px)', ease: 'power2.out' }, a);
        if (i < lineEls.length - 1) {
          tl.to(el, { autoAlpha: 0, y: -14, ease: 'power1.in' }, b);
        }
      });

      // Ligne verticale se déroule à la fin
      tl.fromTo(
        lineRef.current,
        { scaleY: 0, transformOrigin: 'top center' },
        { scaleY: 1, ease: 'none' },
        0.78,
      );
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
          background:
            'radial-gradient(ellipse at 50% 55%, rgba(74,31,31,0.35) 0%, rgba(74,31,31,0.08) 48%, transparent 72%)',
        }}
      >
        <p
          className="mb-14 font-body text-[0.68rem] font-extralight uppercase tracking-[0.55em] text-or-pur"
          style={{ fontWeight: 200 }}
        >
          — Manifeste
        </p>

        <div className="relative mx-auto min-h-[10rem] w-full max-w-[960px] text-center">
          {LINES.map((line, i) => (
            <p
              key={line}
              ref={lineEls[i]}
              className="absolute inset-x-0 top-0 font-display text-[clamp(1.6rem,3.8vw,3.25rem)] font-light italic leading-snug text-ivoire-chaud"
              style={{ opacity: 0 }}
            >
              {line}
            </p>
          ))}
        </div>

        <div
          ref={lineRef}
          className="mx-auto mt-24 h-24 w-px bg-or-pur"
          aria-hidden
          style={{ transformOrigin: 'top center', transform: 'scaleY(0)' }}
        />
      </div>
    </div>
  );
}
