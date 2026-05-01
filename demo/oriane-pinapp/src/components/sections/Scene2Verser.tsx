'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function Scene2Verser() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const capRef = useRef<HTMLDivElement>(null);
  const phraseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.timeline({
        scrollTrigger: {
          trigger: wrap,
          start: 'top top',
          end: '+=150%',
          pin: true,
          scrub: 0.75,
        },
      })
        .fromTo(capRef.current, { y: 0 }, { y: -72, ease: 'none' }, 0)
        .fromTo(phraseRef.current, { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, ease: 'none' }, 0.45);
    }, wrap);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapRef} className="relative min-h-[100dvh] bg-noir-profond" aria-label="Le flacon s&apos;ouvre">
      <div className="flex min-h-[100dvh] flex-col items-center justify-center px-[6vw]">
        <div className="relative mx-auto flex h-[280px] w-[120px] items-start justify-center md:h-[340px] md:w-[140px]">
          <div className="absolute bottom-0 h-[220px] w-[100px] rounded-b-[40%] rounded-t-[12%] border border-or-pur/40 bg-gradient-to-b from-white/5 to-or-pur/10 md:h-[260px] md:w-[110px]" />
          <div
            ref={capRef}
            className="absolute -top-2 left-1/2 z-[2] h-10 w-24 -translate-x-1/2 rounded-t-full border border-or-pur bg-gradient-to-b from-or-liquide/90 to-or-pur/80"
          />
        </div>
        <div ref={phraseRef} className="mt-16 max-w-xl text-center">
          <p className="font-display text-[clamp(1.5rem,4vw,2.75rem)] font-light italic leading-snug text-ivoire-chaud">
            Capturer l&apos;instant
            <br />
            où le monde change de couleur.
          </p>
        </div>
      </div>
    </div>
  );
}
