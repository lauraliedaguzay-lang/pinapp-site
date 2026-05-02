'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Particules CSS jaillissant du capuchon.
 * Keyframes uniques par particule (valeurs px hardcodées) pour éviter
 * le problème CSS var() dans @keyframes calc() de certains navigateurs.
 */
function CapParticles({ count = 26 }: { count?: number }) {
  const particles = Array.from({ length: count }, (_, i) => {
    // Éventail vers le haut : angles de -160° à -20°
    const angle = -160 + (i / (count - 1)) * 140;
    const dist = 28 + (i % 6) * 14;
    const tx = Math.cos((angle * Math.PI) / 180) * dist;
    const ty = Math.sin((angle * Math.PI) / 180) * dist;
    const dur = (0.7 + (i % 4) * 0.25).toFixed(2);
    const delay = ((i % 7) * 0.11).toFixed(2);
    const size = 2 + (i % 3) * 1.5;
    const colors = ['#F4C977', '#D4A574', '#F4E4C1', '#F4C977'];
    const color = colors[i % colors.length]!;
    const name = `capJet_${i}`;
    return { tx, ty, dur, delay, size, color, name };
  });

  const styleContent =
    particles
      .map(
        (p) => `
    @keyframes ${p.name} {
      0%   { transform: translate(-50%, 0px) scale(1); opacity: 0; }
      10%  { opacity: 1; }
      78%  { opacity: 0.15; transform: translate(calc(-50% + ${p.tx.toFixed(1)}px), ${p.ty.toFixed(1)}px) scale(0.25); }
      100% { opacity: 0;    transform: translate(calc(-50% + ${p.tx.toFixed(1)}px), ${p.ty.toFixed(1)}px) scale(0); }
    }`,
      )
      .join('\n') +
    '\n@media (prefers-reduced-motion: reduce) { .cap-particle { display: none !important; } }';

  return (
    <div className="pointer-events-none absolute left-1/2 top-0 z-[3] -translate-x-1/2" aria-hidden>
      <style>{styleContent}</style>
      {particles.map((p) => (
        <div
          key={p.name}
          className="cap-particle absolute rounded-full"
          style={{
            left: '50%',
            top: 0,
            width: p.size,
            height: p.size,
            background: p.color,
            boxShadow: `0 0 5px 1px ${p.color}99`,
            animationName: p.name,
            animationDuration: `${p.dur}s`,
            animationDelay: `${p.delay}s`,
            animationTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
            animationIterationCount: 'infinite',
            opacity: 0,
          }}
        />
      ))}
    </div>
  );
}

export function Scene2Verser() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const capRef = useRef<HTMLDivElement>(null);
  const flaconWrapRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const phraseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    gsap.registerPlugin(ScrollTrigger);

    // État initial via GSAP (pas d'inline style dans le JSX)
    gsap.set(particlesRef.current, { autoAlpha: 0 });
    gsap.set(phraseRef.current, { autoAlpha: 0, y: 32 });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrap,
          start: 'top top',
          end: '+=150%',
          pin: true,
          scrub: 0.8,
        },
      });

      // Capuchon se lève (tween dur 1 → 100% du scrub = 1.5vp)
      tl.fromTo(capRef.current, { y: 0 }, { y: -96, ease: 'none', duration: 1 }, 0);

      // Paillettes : apparaissent dès le début (0.05) et disparaissent à mi-chemin (0.55)
      tl.fromTo(
        particlesRef.current,
        { autoAlpha: 0 },
        { autoAlpha: 1, ease: 'none', duration: 0.2 },
        0.05,
      );
      tl.to(particlesRef.current, { autoAlpha: 0, ease: 'none', duration: 0.2 }, 0.55);

      // Flacon dérive vers coin haut-droit
      tl.fromTo(
        flaconWrapRef.current,
        { x: 0, y: 0, scale: 1 },
        { x: '8vw', y: '-8vh', scale: 0.82, ease: 'none', duration: 1 },
        0,
      );

      // Phrase révèle dans la deuxième moitié du scrub
      tl.fromTo(
        phraseRef.current,
        { autoAlpha: 0, y: 32 },
        { autoAlpha: 1, y: 0, ease: 'none', duration: 0.35 },
        0.55,
      );
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
        <div
          ref={flaconWrapRef}
          className="relative mx-auto flex h-[300px] w-[130px] items-start justify-center md:h-[360px] md:w-[150px]"
        >
          {/* Corps */}
          <div
            className="absolute bottom-0 h-[230px] w-[108px] rounded-b-[38%] rounded-t-[10%] md:h-[280px] md:w-[120px]"
            style={{
              background:
                'linear-gradient(160deg, rgba(244,201,119,0.12) 0%, rgba(212,165,116,0.22) 50%, rgba(74,31,31,0.15) 100%)',
              border: '1px solid rgba(212,165,116,0.45)',
              boxShadow:
                '0 0 40px -16px rgba(244,201,119,0.25), inset 0 0 20px rgba(244,201,119,0.05)',
            }}
          >
            <div
              className="absolute bottom-0 left-[8%] right-[8%] rounded-b-[35%]"
              style={{
                height: '62%',
                background:
                  'linear-gradient(180deg, rgba(244,201,119,0.35) 0%, rgba(244,201,119,0.55) 100%)',
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
          <div ref={particlesRef} className="absolute left-1/2 z-[4]" style={{ top: 48 }}>
            <CapParticles count={28} />
          </div>
        </div>

        {/* Phrase */}
        <div ref={phraseRef} className="mt-14 max-w-xl text-center">
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
