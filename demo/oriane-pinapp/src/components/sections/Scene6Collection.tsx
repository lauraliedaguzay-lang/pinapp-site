'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { fragrances } from '../../data/fragrances';

/**
 * Paillettes qui convergent vers le centre (silhouette flacon).
 * CSS-only pour garder les performances.
 */
function ConvergeSparkles({ count = 40 }: { count?: number }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {Array.from({ length: count }, (_, i) => {
        const r = (k: number) => {
          const x = Math.sin((i * 29.3 + k + 11) * 12.9898) * 43758.5453;
          return x - Math.floor(x);
        };
        // Position initiale dispersée
        const startLeft = `${r(0) * 100}%`;
        const startTop = `${r(1) * 100}%`;
        // Cible : converge vers le centre-haut (flacon)
        const endDx = (0.5 - r(0)) * 88; // vers le centre
        const endDy = (0.3 - r(1)) * 80;
        const size = 1.5 + r(2) * 3;
        const colors = ['#F4C977', '#D4A574', '#F4E4C1'];
        const color = colors[Math.floor(r(3) * colors.length)]!;
        const dur = 3 + r(4) * 5;
        const delay = r(5) * 6;
        return (
          <div
            key={i}
            className="conv-sparkle absolute rounded-full"
            style={{
              left: startLeft,
              top: startTop,
              width: size,
              height: size,
              background: color,
              boxShadow: `0 0 6px 2px ${color}88`,
              '--ddx': `${endDx}px`,
              '--ddy': `${endDy}px`,
              '--dur': `${dur}s`,
              '--delay': `${delay}s`,
            } as React.CSSProperties}
          />
        );
      })}
      <style>{`
        .conv-sparkle {
          opacity: 0;
          animation: converge var(--dur, 4s) cubic-bezier(0.25,0.46,0.45,0.94) var(--delay, 0s) infinite;
        }
        @keyframes converge {
          0%   { opacity: 0;    transform: translate(0, 0) scale(1); }
          15%  { opacity: 0.9; }
          75%  { opacity: 0.3;  transform: translate(var(--ddx), var(--ddy)) scale(0.25); }
          100% { opacity: 0;    transform: translate(var(--ddx), var(--ddy)) scale(0); }
        }
        @media (prefers-reduced-motion: reduce) { .conv-sparkle { display: none; } }
      `}</style>
    </div>
  );
}

export function Scene6Collection() {
  const wrapRef = useRef<HTMLElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const card1Ref = useRef<HTMLElement>(null);
  const card2Ref = useRef<HTMLElement>(null);
  const card3Ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      // Intro fade-in
      gsap.fromTo(
        introRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: introRef.current,
            start: 'top 80%',
            once: true,
          },
        },
      );

      // Cards staggered reveal
      const cardEls = [card1Ref.current, card2Ref.current, card3Ref.current].filter(Boolean);
      gsap.fromTo(
        cardEls,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          stagger: 0.18,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: cardsRef.current,
            start: 'top 75%',
            once: true,
          },
        },
      );
    }, wrap);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={wrapRef}
      id="collection"
      className="relative overflow-hidden bg-noir-profond px-[6vw] py-[14vh]"
      style={{ clipPath: 'polygon(0 3%, 100% 0, 100% 100%, 0 100%)' }}
    >
      {/* Paillettes convergentes en fond */}
      <ConvergeSparkles count={45} />

      {/* Ligne verticale décorative */}
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 top-0 -translate-x-1/2 opacity-5"
        style={{ width: 1, background: 'linear-gradient(180deg, transparent, #D4A574, transparent)' }}
        aria-hidden
      />

      <div className="relative z-[10] mx-auto max-w-[1100px]">
        {/* En-tête */}
        <div ref={introRef} className="mb-16 text-center md:text-left" style={{ opacity: 0 }}>
          <p
            className="mb-4 font-body text-[0.68rem] font-extralight uppercase tracking-[0.5em] text-or-pur"
            style={{ fontWeight: 200 }}
          >
            — La Collection
          </p>
          <h2 className="font-display text-[clamp(2rem,4.5vw,3.25rem)] font-light italic text-ivoire-chaud">
            Trois fragrances, un trajet de jour.
          </h2>
        </div>

        {/* Cards éditoriales */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 gap-6 md:grid-cols-3"
        >
          {fragrances.map((f, i) => {
            const cardRef = [card1Ref, card2Ref, card3Ref][i]!;
            return (
              <article
                key={f.id}
                ref={cardRef}
                className="group relative overflow-hidden"
                style={{ opacity: 0 }}
              >
                {/* Cadre or */}
                <div
                  className="absolute inset-0 z-[2] rounded-sm transition-all duration-500 group-hover:shadow-[0_0_40px_-10px_rgba(244,201,119,0.3)]"
                  style={{ border: '1px solid rgba(212,165,116,0.45)' }}
                  aria-hidden
                />
                {/* Coin or décoratif */}
                <div
                  className="absolute right-0 top-0 z-[3] h-8 w-8 opacity-70 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background: `linear-gradient(135deg, transparent 50%, rgba(212,165,116,0.6) 50%)`,
                  }}
                  aria-hidden
                />

                {/* Image */}
                <div
                  className="aspect-[3/4] w-full overflow-hidden"
                >
                  <div
                    className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{
                      backgroundImage: `url(${f.photoUrl})`,
                      filter: f.filterCSS !== 'none' ? f.filterCSS : undefined,
                    }}
                    role="img"
                    aria-label={f.photoAlt}
                  />
                </div>

                {/* Overlay gradient hover */}
                <div
                  className="pointer-events-none absolute inset-0 z-[1] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background: `linear-gradient(to top, rgba(10,8,5,0.88) 0%, rgba(10,8,5,0.4) 40%, transparent 70%)`,
                  }}
                  aria-hidden
                />

                {/* Légende */}
                <div
                  className="relative z-[2] border-t px-5 py-5"
                  style={{ borderColor: 'rgba(212,165,116,0.3)', background: 'rgba(21,17,13,0.95)' }}
                >
                  <p
                    className="mb-1 font-body text-[0.62rem] font-extralight uppercase tracking-[0.4em] text-or-pur"
                    style={{ fontWeight: 200 }}
                  >
                    {f.numero} — {f.heure}
                  </p>
                  <h3 className="font-display text-xl font-light italic text-ivoire-chaud">
                    {f.nom}
                  </h3>
                  <p className="mt-2 font-body text-[0.78rem] font-light leading-relaxed text-ivoire-soft line-clamp-2">
                    {f.description}
                  </p>
                  <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
                    {f.notes.map((n) => (
                      <li
                        key={n}
                        className="font-body text-[0.65rem] italic text-or-pur"
                        style={{ fontWeight: 200 }}
                      >
                        {n}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
