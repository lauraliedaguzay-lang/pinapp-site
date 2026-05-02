'use client';

import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FlaconOpenScene } from '../canvas/FlaconOpenScene';

gsap.registerPlugin(ScrollTrigger);

export function Scene2Verser() {
  const sectionRef   = useRef<HTMLElement>(null);
  const phraseRef    = useRef<HTMLDivElement>(null);
  const scrollProgress = useRef(0);
  const [mounted, setMounted] = useState(false);

  // ── Mount ──
  useEffect(() => { setMounted(true); }, []);

  // ── GSAP pin + phrase reveal + scroll progress ──
  useEffect(() => {
    if (!mounted) return;
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=150%',
          pin: true,
          scrub: 0.8,
          onUpdate: (self) => {
            scrollProgress.current = self.progress;
          },
        },
      });

      // Phrase révèle dans la deuxième moitié du scrub (60 % → 90 %)
      tl.fromTo(
        phraseRef.current,
        { autoAlpha: 0, y: 32 },
        { autoAlpha: 1, y: 0, ease: 'none', duration: 0.3 },
        0.6,
      );
    }, section);

    return () => ctx.revert();
  }, [mounted]);

  return (
    <section
      ref={sectionRef}
      aria-label="Le flacon s'ouvre"
      className="relative h-[100dvh] w-full overflow-hidden bg-[#0A0805]"
    >
      {/* Canvas R3F plein écran — monté après hydratation */}
      {mounted && (
        <div className="absolute inset-0 z-0" aria-hidden>
          <FlaconOpenScene scrollProgress={scrollProgress} />
        </div>
      )}

      {/* Vignette CSS */}
      <div
        className="pointer-events-none absolute inset-0 z-[5]"
        style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)' }}
        aria-hidden
      />

      {/* Gradient bas — fondu vers scène suivante */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 h-52"
        style={{ background: 'linear-gradient(to bottom, transparent, #040101)' }}
        aria-hidden
      />

      {/* Phrase overlay */}
      <div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-end justify-center pb-[12vh] pr-[8vw] text-right">
        <div ref={phraseRef}>
          <p
            className="font-display font-light italic leading-snug text-ivoire-chaud"
            style={{
              fontSize: 'clamp(1.4rem, 3.2vw, 2.4rem)',
              textShadow: '0 0 30px rgba(244,201,119,0.25)',
            }}
          >
            Capturer l&apos;instant<br />
            où le monde change de couleur.
          </p>
          <div className="mt-8 flex items-center justify-end gap-3 text-or-pale/50">
            <span
              className="font-body uppercase tracking-[0.4em]"
              style={{ fontSize: '0.55rem' }}
            >
              Manifeste
            </span>
            <span className="h-px w-8 bg-or-pale/40" />
          </div>
        </div>
      </div>
    </section>
  );
}
