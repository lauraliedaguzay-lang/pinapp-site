'use client';

import { useMemo, useRef } from 'react';
import { fragrances } from '../../data/fragrances';
import { useSectionScrollProgress } from '../../hooks/useSectionScrollProgress';
import { Photo3D } from '../ui/Photo3D';

/** Tache de couleur douce adaptée à chaque fragrance */
const GLOW_CONFIGS = [
  { color: 'rgba(232,197,192,0.18)', name: 'blush rose', sparkles: ['#F4C977', '#E8C5C0', '#F4E4C1'] },
  { color: 'rgba(184,162,200,0.18)', name: 'mauve', sparkles: ['#B8A2C8', '#D4A574', '#C8B89E'] },
  { color: 'rgba(212,165,116,0.22)', name: 'or', sparkles: ['#F4C977', '#D4A574', '#F4C977'] },
] as const;

function MicroSparkles({ colors, seed }: { colors: readonly string[]; seed: number }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {Array.from({ length: 18 }, (_, i) => {
        const r = (k: number) => {
          const x = Math.sin((seed + i * 31.7 + k) * 12.9898) * 43758.5453;
          return x - Math.floor(x);
        };
        const left = `${4 + r(0) * 92}%`;
        const top = `${4 + r(1) * 92}%`;
        const size = 2 + r(2) * 3;
        const color = colors[Math.floor(r(3) * colors.length)]!;
        const dur = 2.5 + r(4) * 3;
        const delay = r(5) * 4;
        return (
          <div
            key={i}
            className="scene4-sparkle absolute rounded-full"
            style={{
              left,
              top,
              width: size,
              height: size,
              background: color,
              boxShadow: `0 0 6px 2px ${color}88`,
              animationDuration: `${dur}s`,
              animationDelay: `${delay}s`,
            }}
          />
        );
      })}
      <style>{`
        .scene4-sparkle {
          opacity: 0;
          animation: s4drift var(--dur,3s) ease-in-out var(--delay,0s) infinite;
        }
        @keyframes s4drift {
          0%,100% { opacity:0; transform: scale(0.5) translateY(0); }
          30%      { opacity:0.85; }
          60%      { opacity:0.5; transform: scale(1) translateY(-12px); }
        }
        @media (prefers-reduced-motion: reduce) { .scene4-sparkle { display:none; } }
      `}</style>
    </div>
  );
}

export function Scene4ThreeAubes() {
  const ref = useRef<HTMLElement>(null);
  const progress = useSectionScrollProgress(ref);
  const active = useMemo(() => {
    if (progress < 0.33) return 0;
    if (progress < 0.66) return 1;
    return 2;
  }, [progress]);

  return (
    <section ref={ref} id="gallery" className="relative bg-noir-profond" style={{ height: '300vh' }}>
      <div className="sticky top-0 flex h-[100dvh] flex-col overflow-hidden bg-noir-profond">
        {fragrances.map((f, i) => {
          const glowCfg = GLOW_CONFIGS[i]!;
          return (
            <div
              key={f.id}
              className={`absolute inset-0 grid grid-cols-1 items-center gap-8 px-6 py-8 md:grid-cols-2 md:px-[6vw] ${
                i === active ? 'z-[2] opacity-100' : 'z-[1] opacity-0 pointer-events-none'
              }`}
              style={{ transition: 'opacity 600ms cubic-bezier(0.65,0,0.35,1)' }}
            >
              {/* Fond radial couleur fragrance */}
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background: `radial-gradient(ellipse at 50% 50%, ${glowCfg.color} 0%, transparent 65%)`,
                  transition: 'background 600ms ease',
                }}
                aria-hidden
              />

              <MicroSparkles colors={glowCfg.sparkles} seed={i * 997 + 3} />

              <div className={`relative z-[1] flex justify-center ${i === 1 ? 'md:order-2' : ''}`}>
                <div className="w-3/4 max-w-[min(75vw,28rem)]">
                  <Photo3D
                    active={i === active}
                    index={i}
                    photoUrl={f.photoUrl}
                    photoAlt={f.photoAlt}
                    glowColor={f.couleurGlow}
                    filterCSS={f.filterCSS}
                  />
                </div>
              </div>

              <div className={`relative z-[1] text-left ${i === 1 ? 'md:order-1' : ''}`}>
                <p
                  className="mb-4 font-body text-[0.68rem] font-extralight uppercase tracking-[0.38em] text-or-pur"
                  style={{ fontWeight: 200 }}
                >
                  {f.heure} — {f.sousTitre}
                </p>
                <h2 className="mb-6 font-display text-[clamp(2.2rem,5vw,4rem)] font-light italic text-ivoire-chaud">
                  {f.nom}
                </h2>
                <p className="mb-8 max-w-md font-body text-sm font-light text-ivoire-soft md:text-base">
                  {f.description}
                </p>
                <ul className="space-y-2">
                  {f.notes.map((n) => (
                    <li
                      key={n}
                      className="flex items-center gap-3 font-display text-lg font-light italic text-ivoire-chaud"
                    >
                      <span
                        className="h-px w-8 flex-shrink-0"
                        style={{ background: glowCfg.sparkles[0] }}
                      />
                      {n}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}

        {/* Compteur — masqué hors de la scène pour ne pas déborder sur S5+ */}
        {progress > 0.005 && progress < 0.995 && (
          <div className="pointer-events-none absolute bottom-6 right-6 z-10 flex items-baseline gap-2 md:bottom-10 md:right-10">
            <span className="font-display text-3xl font-light italic text-or-liquide">
              {String(active + 1).padStart(2, '0')}
            </span>
            <span className="font-display text-lg italic text-ivoire-soft">/ 03</span>
          </div>
        )}
      </div>
    </section>
  );
}
