'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function Scene8Footer() {
  const sigRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const creditRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const els = [sigRef.current, lineRef.current, creditRef.current];
    if (els.some((e) => !e) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        sigRef.current,
        { opacity: 0, letterSpacing: '0.05em', filter: 'blur(4px)' },
        {
          opacity: 1,
          letterSpacing: '0.18em',
          filter: 'blur(0px)',
          duration: 1.4,
          ease: 'power2.out',
          scrollTrigger: { trigger: sigRef.current, start: 'top 85%', once: true },
        },
      );
      gsap.fromTo(
        lineRef.current,
        { scaleX: 0, opacity: 0 },
        {
          scaleX: 1,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          delay: 0.5,
          scrollTrigger: { trigger: sigRef.current, start: 'top 85%', once: true },
        },
      );
      gsap.fromTo(
        creditRef.current,
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out',
          delay: 0.85,
          scrollTrigger: { trigger: sigRef.current, start: 'top 85%', once: true },
        },
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <footer
      className="relative flex min-h-[50vh] flex-col items-center justify-center overflow-hidden bg-noir-profond px-[6vw] py-16 text-center"
    >
      {/* Fond or très léger */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 60%, rgba(212,165,116,0.06) 0%, transparent 55%)',
        }}
        aria-hidden
      />

      <div
        ref={sigRef}
        className="relative z-[1] font-display font-light italic tracking-[0.15em] text-or-liquide"
        style={{ fontSize: 'clamp(2.5rem,5vw,3.75rem)', opacity: 0 }}
      >
        M · O
      </div>

      <div
        ref={lineRef}
        className="relative z-[1] mx-auto mt-6 h-px w-20 origin-center bg-or-pur"
        aria-hidden
        style={{ opacity: 0, transformOrigin: 'center' }}
      />

      <p
        ref={creditRef}
        className="relative z-[1] mt-8 font-body text-[0.68rem] font-extralight uppercase tracking-[0.42em] text-or-pale"
        style={{ fontWeight: 200, opacity: 0 }}
      >
        Production Pinapp Studio · Bordeaux 2026
      </p>
    </footer>
  );
}
