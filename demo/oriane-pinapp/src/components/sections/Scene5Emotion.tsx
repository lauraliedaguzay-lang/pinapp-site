'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

/** Paillettes lentes en dérive douce — CSS uniquement */
function SlowDriftSparkles({ count = 26 }: { count?: number }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {Array.from({ length: count }, (_, i) => {
        const r = (k: number) => {
          const x = Math.sin((i * 41.3 + k + 7) * 12.9898) * 43758.5453;
          return x - Math.floor(x);
        };
        const left = `${2 + r(0) * 96}%`;
        const top = `${5 + r(1) * 90}%`;
        const size = 1.5 + r(2) * 2.5;
        const colors = ['#F4C977', '#D4A574', '#F4E4C1', '#F4C977', '#C8B89E'];
        const color = colors[Math.floor(r(3) * colors.length)]!;
        const dur = (6 + r(4) * 10).toFixed(1);
        const delay = (r(5) * 12).toFixed(1);
        const driftX = ((r(6) - 0.5) * 30).toFixed(1);
        const name = `s5drift_${i}`;
        return (
          <div key={i}>
            <style>{`
              @keyframes ${name} {
                0%   { opacity: 0;    transform: translateY(0px)   translateX(0px)          scale(0.6); }
                20%  { opacity: 0.7; }
                50%  { opacity: 0.45; transform: translateY(-20px) translateX(${driftX}px) scale(1); }
                80%  { opacity: 0.25; }
                100% { opacity: 0;    transform: translateY(-40px) translateX(${(parseFloat(driftX) * 1.5).toFixed(1)}px) scale(0.4); }
              }
            `}</style>
            <div
              className="absolute rounded-full"
              style={{
                left,
                top,
                width: size,
                height: size,
                background: color,
                boxShadow: `0 0 8px 2px ${color}66`,
                animationName: name,
                animationDuration: `${dur}s`,
                animationDelay: `${delay}s`,
                animationTimingFunction: 'ease-in-out',
                animationIterationCount: 'infinite',
                opacity: 0,
              }}
            />
          </div>
        );
      })}
    </div>
  );
}

export function Scene5Emotion() {
  const wrapRef = useRef<HTMLElement>(null);
  const line1Ref = useRef<HTMLParagraphElement>(null);
  const line2Ref = useRef<HTMLParagraphElement>(null);
  const runeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // État initial via GSAP — pas d'inline style dans le JSX
    gsap.set(line1Ref.current, { opacity: 0, y: 22, filter: 'blur(4px)' });
    gsap.set(line2Ref.current, { opacity: 0, y: 22, filter: 'blur(4px)' });
    gsap.set(runeRef.current, { opacity: 0, scaleX: 0 });

    // IntersectionObserver fiable même après sections pinnées
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        obs.disconnect();
        const tl = gsap.timeline();
        tl.to(line1Ref.current, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.1, ease: 'power2.out' }, 0);
        tl.to(line2Ref.current, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.1, ease: 'power2.out' }, 0.55);
        tl.to(runeRef.current, { opacity: 1, scaleX: 1, duration: 0.8, ease: 'power3.out' }, 1.25);
      },
      { threshold: 0.12 },
    );
    obs.observe(wrap);

    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={wrapRef}
      className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden bg-noir-profond px-[8vw] py-24 text-center"
      aria-label="Moment d'émotion"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 45%, rgba(244,201,119,0.06) 0%, transparent 60%)',
        }}
        aria-hidden
      />

      <SlowDriftSparkles count={30} />

      <blockquote className="relative z-[1] max-w-3xl space-y-8">
        <p
          ref={line1Ref}
          className="font-display text-[clamp(1.65rem,4vw,2.85rem)] font-light italic leading-snug text-ivoire-chaud"
        >
          Le parfum n&apos;est pas seulement une signature.
        </p>
        <p
          ref={line2Ref}
          className="font-display text-[clamp(1.65rem,4vw,2.85rem)] font-light italic leading-snug text-ivoire-soft"
        >
          C&apos;est un sillage qui dit qui nous sommes
          <br />
          quand nous ne disons rien.
        </p>
      </blockquote>

      <span
        ref={runeRef}
        className="relative z-[1] mt-14 block h-px w-20 origin-center bg-or-pur"
        aria-hidden
      />
    </section>
  );
}
