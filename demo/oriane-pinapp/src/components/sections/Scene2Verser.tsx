'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/** Particules CSS jaillissant du capuchon */
function CapParticles({ count = 22 }: { count?: number }) {
  return (
    <div className="pointer-events-none absolute left-1/2 top-0 z-[3] -translate-x-1/2" aria-hidden>
      {Array.from({ length: count }, (_, i) => {
        const angle = -90 + (i / count) * 140 - 70; // -160° à -20°
        const dist = 30 + (i % 5) * 18;
        const tx = Math.cos((angle * Math.PI) / 180) * dist;
        const ty = Math.sin((angle * Math.PI) / 180) * dist;
        const dur = 0.8 + (i % 4) * 0.3;
        const delay = (i % 7) * 0.12;
        const size = 2 + (i % 3) * 1.5;
        const colors = ['#F4C977', '#D4A574', '#F4E4C1', '#F4C977'];
        const color = colors[i % colors.length];
        return (
          <div
            key={i}
            className="cap-particle absolute"
            style={{
              left: '50%',
              top: 0,
              width: size,
              height: size,
              borderRadius: '50%',
              background: color,
              boxShadow: `0 0 4px 1px ${color}88`,
              '--tx': `${tx}px`,
              '--ty': `${ty}px`,
              animationDuration: `${dur}s`,
              animationDelay: `${delay}s`,
            } as React.CSSProperties}
          />
        );
      })}
      <style>{`
        .cap-particle {
          opacity: 0;
          animation: capJet var(--dur, 0.9s) cubic-bezier(0.22, 1, 0.36, 1) var(--delay, 0s) infinite;
        }
        @keyframes capJet {
          0%   { transform: translate(-50%, 0) scale(1); opacity: 0; }
          12%  { opacity: 1; }
          80%  { opacity: 0.2; transform: translate(calc(-50% + var(--tx)), var(--ty)) scale(0.3); }
          100% { opacity: 0; transform: translate(calc(-50% + var(--tx)), var(--ty)) scale(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .cap-particle { display: none; }
        }
      `}</style>
    </div>
  );
}

export function Scene2Verser() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const capRef = useRef<HTMLDivElement>(null);
  const flaconBodyRef = useRef<HTMLDivElement>(null);
  const flaconWrapRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const phraseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrap,
          start: 'top top',
          end: '+=150%',
          pin: true,
          scrub: 0.75,
        },
      });

      // Capuchon se lève
      tl.fromTo(capRef.current, { y: 0 }, { y: -88, ease: 'none' }, 0);

      // Paillettes apparaissent quand capuchon bouge (scrub 0.1–0.55)
      tl.fromTo(particlesRef.current, { autoAlpha: 0 }, { autoAlpha: 1, ease: 'none' }, 0.05);
      tl.to(particlesRef.current, { autoAlpha: 0, ease: 'none' }, 0.55);

      // Flacon dérive vers coin haut-droit (parallax)
      tl.fromTo(
        flaconWrapRef.current,
        { x: 0, y: 0, scale: 1 },
        { x: '8vw', y: '-8vh', scale: 0.82, ease: 'none' },
        0,
      );

      // Phrase révèle
      tl.fromTo(phraseRef.current, { autoAlpha: 0, y: 32 }, { autoAlpha: 1, y: 0, ease: 'none' }, 0.42);
    }, wrap);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={wrapRef}
      className="relative min-h-[100dvh] bg-noir-profond"
      aria-label="Le flacon s'ouvre"
    >
      <div className="flex min-h-[100dvh] flex-col items-center justify-center px-[6vw]">
        {/* Flacon CSS */}
        <div ref={flaconWrapRef} className="relative mx-auto flex h-[300px] w-[130px] items-start justify-center md:h-[360px] md:w-[150px]">
          {/* Corps */}
          <div
            ref={flaconBodyRef}
            className="absolute bottom-0 h-[230px] w-[108px] rounded-b-[38%] rounded-t-[10%] md:h-[280px] md:w-[120px]"
            style={{
              background: 'linear-gradient(160deg, rgba(244,201,119,0.12) 0%, rgba(212,165,116,0.22) 50%, rgba(74,31,31,0.15) 100%)',
              border: '1px solid rgba(212,165,116,0.45)',
              boxShadow: '0 0 40px -16px rgba(244,201,119,0.25), inset 0 0 20px rgba(244,201,119,0.05)',
            }}
          >
            {/* Liquide intérieur */}
            <div
              className="absolute bottom-0 left-[8%] right-[8%] rounded-b-[35%]"
              style={{
                height: '62%',
                background: 'linear-gradient(180deg, rgba(244,201,119,0.35) 0%, rgba(244,201,119,0.55) 100%)',
              }}
            />
          </div>

          {/* Capuchon */}
          <div
            ref={capRef}
            className="absolute left-1/2 z-[2] -translate-x-1/2"
            style={{
              top: 52,
              height: 44,
              width: 96,
              borderRadius: '40% 40% 10% 10% / 60% 60% 20% 20%',
              background: 'linear-gradient(160deg, #f4c977 0%, #d4a574 55%, #8b6f47 100%)',
              boxShadow: '0 4px 20px rgba(244,201,119,0.3)',
            }}
          />

          {/* Jet de paillettes */}
          <div
            ref={particlesRef}
            className="absolute left-1/2 z-[4]"
            style={{ top: 48, opacity: 0 }}
          >
            <CapParticles count={28} />
          </div>
        </div>

        {/* Phrase */}
        <div ref={phraseRef} className="mt-14 max-w-xl text-center" style={{ opacity: 0 }}>
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
