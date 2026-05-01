'use client';

import { useMemo, useRef } from 'react';
import { fragrances } from '../../data/fragrances';
import { useSectionScrollProgress } from '../../hooks/useSectionScrollProgress';
import { Photo3D } from '../ui/Photo3D';

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
        {fragrances.map((f, i) => (
          <div
            key={f.id}
            className={`absolute inset-0 grid grid-cols-1 items-center gap-8 px-6 py-8 transition-opacity duration-500 md:grid-cols-2 md:px-[6vw] ${
              i === active ? 'z-[2] opacity-100' : 'z-[1] opacity-0 pointer-events-none'
            }`}
          >
            <div className={`flex justify-center ${i === 1 ? 'md:order-2' : ''}`}>
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
            <div className={`text-left ${i === 1 ? 'md:order-1' : ''}`}>
              <p className="mb-4 font-body text-[0.7rem] font-extralight uppercase tracking-[0.35em] text-or-pur" style={{ fontWeight: 200 }}>
                {f.heure} — {f.sousTitre}
              </p>
              <h2 className="mb-6 font-display text-[clamp(2.2rem,5vw,4rem)] font-light italic text-ivoire-chaud">{f.nom}</h2>
              <p className="mb-8 max-w-md font-body text-sm font-light text-ivoire-soft md:text-base">{f.description}</p>
              <ul className="space-y-2">
                {f.notes.map((n) => (
                  <li key={n} className="flex items-center gap-3 font-display text-lg font-light italic text-ivoire-chaud">
                    <span className="h-px w-8 bg-or-pur" />
                    {n}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
        <div className="pointer-events-none absolute bottom-6 right-6 z-10 flex items-baseline gap-2 md:bottom-10 md:right-10">
          <span className="font-display text-3xl font-light italic text-or-liquide">{String(active + 1).padStart(2, '0')}</span>
          <span className="font-display text-lg italic text-ivoire-soft">/ 03</span>
        </div>
      </div>
    </section>
  );
}
