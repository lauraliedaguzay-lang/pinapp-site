'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useIsInViewport } from '../../hooks/useIsInViewport';
import { useMousePosition } from '../../hooks/useMousePosition';
import { useScrollProgress } from '../../hooks/useScrollProgress';
import { HeroCanvas } from '../canvas/HeroCanvas';
import { FlaconLathe, type FlaconPhase } from '../canvas/FlaconLathe';
import { ScrambleText } from '../ui/ScrambleText';

const PRELOADER_MS = 2400 + 800;
/** Fin séquence flacon ~3s ; crossfade 7–8s après démarrage flacon (post-preloader). */
const FADE_START_S = 7;
const FADE_END_S = 8;

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const heroActive = useIsInViewport(sectionRef, { initialInViewport: true });
  const { x: mouseX, y: mouseY } = useMousePosition();
  const scrollProgress = useScrollProgress();
  const [flaconStart, setFlaconStart] = useState<number | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [showFlaconCanvas, setShowFlaconCanvas] = useState(true);
  const phaseRef = useRef<FlaconPhase>('building');
  const flaconLayerRef = useRef<HTMLDivElement>(null);
  const photoLayerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setReducedMotion(reduced);
    const delay = reduced ? 300 : PRELOADER_MS;
    const id = window.setTimeout(() => {
      setFlaconStart(performance.now());
    }, delay);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (flaconStart === null) return;

    if (reducedMotion) {
      if (flaconLayerRef.current) flaconLayerRef.current.style.opacity = '1';
      if (photoLayerRef.current) photoLayerRef.current.style.opacity = '0';
      const t = window.setTimeout(() => {
        if (flaconLayerRef.current) flaconLayerRef.current.style.opacity = '0';
        if (photoLayerRef.current) photoLayerRef.current.style.opacity = '1';
        setShowFlaconCanvas(false);
      }, 3500);
      return () => window.clearTimeout(t);
    }

    if (!heroActive) {
      return undefined;
    }

    let raf = 0;
    let stopped = false;
    const tick = () => {
      if (stopped) return;
      const s = (performance.now() - flaconStart) / 1000;
      const fl = flaconLayerRef.current;
      const ph = photoLayerRef.current;
      if (!fl) return;

      if (s < FADE_START_S) {
        fl.style.opacity = '1';
        if (ph) {
          ph.style.opacity = '0';
          ph.style.pointerEvents = 'none';
        }
      } else if (s < FADE_END_S) {
        const u = s - FADE_START_S;
        fl.style.opacity = String(1 - u);
        if (ph) {
          ph.style.opacity = String(u);
          ph.style.pointerEvents = u > 0.5 ? 'auto' : 'none';
        }
      } else {
        fl.style.opacity = '0';
        if (ph) {
          ph.style.opacity = '1';
          ph.style.pointerEvents = 'auto';
        }
        setShowFlaconCanvas(false);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      stopped = true;
      cancelAnimationFrame(raf);
    };
  }, [flaconStart, reducedMotion, heroActive]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100dvh] overflow-hidden bg-ivoire"
    >
      <div className="absolute inset-0 z-[1]">
        {flaconStart !== null && (
          <>
            {showFlaconCanvas && (
              <div
                ref={flaconLayerRef}
                className="absolute inset-0 transition-none"
                style={{ opacity: 1 }}
              >
                <Suspense fallback={null}>
                  <FlaconLathe
                    startTime={flaconStart}
                    phaseRef={phaseRef}
                    reducedMotion={reducedMotion}
                    active={heroActive}
                  />
                </Suspense>
              </div>
            )}
            <div
              ref={photoLayerRef}
              className="absolute inset-0"
              style={{ opacity: 0, pointerEvents: 'none' }}
            >
              <Suspense fallback={null}>
                <HeroCanvas
                  mouseX={mouseX}
                  mouseY={mouseY}
                  scrollProgress={scrollProgress}
                  active={heroActive}
                />
              </Suspense>
            </div>
          </>
        )}
      </div>

      <div
        className="hero-brume pointer-events-none absolute inset-0 z-[2] mix-blend-soft-light"
        aria-hidden
        style={{
          background: `radial-gradient(ellipse at 20% 80%, rgba(232, 197, 192, 0.4) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 20%, rgba(184, 162, 200, 0.25) 0%, transparent 55%)`,
        }}
      />

      <div className="relative z-[5] flex min-h-[100dvh] flex-col items-center justify-between px-[6vw] pb-[6vh] pt-[12vh] mix-blend-difference pointer-events-none">
        <p
          className="text-center font-body text-[0.7rem] font-extralight uppercase tracking-[0.5em] text-[#D4A574]"
          style={{ fontWeight: 200 }}
        >
          Parfumerie niche - Bordeaux 2026
        </p>

        <div className="flex flex-col items-center text-center">
          <h1 className="font-display text-[clamp(3.5rem,11vw,8.5rem)] font-light italic leading-none tracking-tight text-[#F7F1EA]">
            <ScrambleText text="ORIANE" delay={1400} />
          </h1>
          <div
            className="mt-8 max-w-xl font-body text-[0.95rem] font-light uppercase tracking-[0.3em] text-[#F7F1EA]"
            style={{ fontWeight: 300 }}
          >
            <ScrambleText
              text="Trois aubes. Trois fragrances. Une maison."
              delay={2800}
            />
          </div>
        </div>

        <p
          className="hero-bob text-center font-body text-[0.65rem] font-extralight uppercase tracking-[0.4em] text-[#F7F1EA]"
          style={{ fontWeight: 200 }}
        >
          Scroll ↓
        </p>
      </div>
    </section>
  );
}
