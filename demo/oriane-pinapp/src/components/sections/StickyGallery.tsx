'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { fragrances } from '../../data/fragrances';
import { useIsInViewport } from '../../hooks/useIsInViewport';
import { useSectionScrollProgress } from '../../hooks/useSectionScrollProgress';
import { Photo3D } from '../ui/Photo3D';

type Fragrance = (typeof fragrances)[number];

const revealEase =
  'transition-all duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)]';

function Panel({
  fragrance,
  isActive,
  reversed,
  index,
  galleryInViewport,
}: {
  fragrance: Fragrance;
  isActive: boolean;
  reversed: boolean;
  index: number;
  galleryInViewport: boolean;
}) {
  /** 0 = hidden, 1 = heure, 2 = titre, 3 = description, 4 = notes */
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setPhase(0);
      return;
    }

    setPhase(1);
    const t2 = window.setTimeout(() => setPhase(2), 200);
    const t3 = window.setTimeout(() => setPhase(3), 400);
    const t4 = window.setTimeout(() => setPhase(4), 600);

    return () => {
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      window.clearTimeout(t4);
    };
  }, [isActive, fragrance.id]);

  const showHeure = isActive && phase >= 1;
  const showTitre = isActive && phase >= 2;
  const showDesc = isActive && phase >= 3;
  const showNotes = isActive && phase >= 4;

  return (
    <div
      className={`absolute inset-0 grid grid-cols-1 items-center gap-6 px-4 py-6 transition-opacity duration-[800ms] max-md:content-start max-md:justify-items-stretch md:grid-cols-2 md:gap-8 md:px-[6vw] md:py-0 ${
        isActive ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      <div
        className={`flex justify-center max-md:order-1 ${reversed ? 'md:order-2' : 'md:order-1'}`}
      >
        <div className="photo-stage mx-auto w-3/4 max-w-[min(75vw,28rem)] md:w-3/4">
          <Photo3D
            active={galleryInViewport && isActive}
            index={index}
            photoUrl={fragrance.photoUrl}
            photoAlt={fragrance.photoAlt}
            glowColor={fragrance.couleurGlow}
            filterCSS={fragrance.filterCSS}
          />
        </div>
      </div>
      <div
        className={`text-wrap max-md:order-2 max-md:px-1 max-md:pb-4 text-left md:p-[4vw] ${reversed ? 'md:order-1' : 'md:order-2'}`}
      >
        <div
          className={`mb-6 font-body text-[0.7rem] font-extralight uppercase tracking-[0.35em] text-or-rose ${revealEase} ${
            showHeure ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
          }`}
          style={{ fontWeight: 200 }}
        >
          {fragrance.heure} — {fragrance.sousTitre}
        </div>
        <h2
          className={`mb-8 font-display text-[clamp(2.5rem,5vw,4.5rem)] font-light italic leading-none tracking-tight text-encre ${revealEase} ${
            showTitre ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
          }`}
        >
          {fragrance.nom}
        </h2>
        <p
          className={`mb-10 max-w-[480px] font-body text-base font-light leading-relaxed text-encre-soft ${revealEase} ${
            showDesc ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
          }`}
        >
          {fragrance.description}
        </p>
        <div
          className={`flex flex-col gap-2 ${revealEase} ${
            showNotes ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
          }`}
        >
          {fragrance.notes.map((note) => (
            <div
              key={note}
              className="flex items-center gap-4 font-display text-xl font-light italic text-encre"
            >
              <span className="h-px w-[30px] shrink-0 bg-or-rose" />
              {note}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function StickyGallery() {
  const ref = useRef<HTMLElement>(null);
  const galleryInViewport = useIsInViewport(ref, { initialInViewport: false });
  const progress = useSectionScrollProgress(ref);

  const activeIndex = useMemo(() => {
    if (progress < 0.33) return 0;
    if (progress < 0.66) return 1;
    return 2;
  }, [progress]);

  return (
    <section
      ref={ref}
      id="gallery"
      className="relative bg-ivoire"
      style={{ height: '400vh' }}
    >
      <div className="sticky top-0 h-[100dvh] overflow-hidden bg-ivoire">
        {fragrances.map((f, i) => (
          <Panel
            key={f.id}
            fragrance={f}
            index={i}
            isActive={i === activeIndex}
            reversed={i === 1}
            galleryInViewport={galleryInViewport}
          />
        ))}

        <div
          className="pointer-events-none absolute bottom-[2vh] right-[4vw] z-10 flex items-baseline gap-3 md:bottom-[4vh] md:right-[6vw] md:gap-4"
          aria-live="polite"
          aria-atomic="true"
        >
          <span
            key={activeIndex}
            className="gallery-counter-num font-display text-2xl font-light italic leading-none text-or-rose md:text-[2.5rem]"
          >
            {String(activeIndex + 1).padStart(2, '0')}
          </span>
          <span className="font-display text-base font-light italic leading-none text-encre-soft md:text-[1.2rem]">
            / 03
          </span>
        </div>
      </div>
    </section>
  );
}
