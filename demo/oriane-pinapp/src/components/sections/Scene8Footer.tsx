'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function Scene8Footer() {
  const sigRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const creditRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const sig = sigRef.current;
    const line = lineRef.current;
    const credit = creditRef.current;
    if (!sig || !line || !credit || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // État initial via GSAP
    gsap.set(sig, { opacity: 0, letterSpacing: '0.05em', filter: 'blur(4px)' });
    gsap.set(line, { scaleX: 0, opacity: 0 });
    gsap.set(credit, { opacity: 0, y: 10 });

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        obs.disconnect();
        const tl = gsap.timeline();
        tl.to(sig, { opacity: 1, letterSpacing: '0.18em', filter: 'blur(0px)', duration: 1.4, ease: 'power2.out' }, 0);
        tl.to(line, { scaleX: 1, opacity: 1, duration: 0.8, ease: 'power2.out' }, 0.5);
        tl.to(credit, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, 0.85);
      },
      { threshold: 0.2 },
    );
    obs.observe(sig);

    return () => obs.disconnect();
  }, []);

  return (
    <footer className="relative flex min-h-[50vh] flex-col items-center justify-center overflow-hidden bg-noir-profond px-[6vw] py-16 text-center">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at 50% 60%, rgba(212,165,116,0.06) 0%, transparent 55%)' }}
        aria-hidden
      />

      <div
        ref={sigRef}
        className="relative z-[1] font-display font-light italic tracking-[0.15em] text-or-liquide"
        style={{ fontSize: 'clamp(2.5rem,5vw,3.75rem)' }}
      >
        M · O
      </div>

      <div
        ref={lineRef}
        className="relative z-[1] mx-auto mt-6 h-px w-20 origin-center bg-or-pur"
        aria-hidden
        style={{ transformOrigin: 'center' }}
      />

      <p
        ref={creditRef}
        className="relative z-[1] mt-8 font-body text-[0.68rem] font-extralight uppercase tracking-[0.42em] text-or-pale"
        style={{ fontWeight: 200 }}
      >
        Production Pinapp Studio · Bordeaux 2026
      </p>
    </footer>
  );
}
