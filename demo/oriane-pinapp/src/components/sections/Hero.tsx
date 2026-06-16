'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useGpuSparkleSettings } from '../../hooks/useGpuSparkleSettings';
import { useIsInViewport } from '../../hooks/useIsInViewport';
import { useMousePosition } from '../../hooks/useMousePosition';
import { FlaconLineArt } from '../canvas/FlaconLineArt';
import { FlaconRealistic, type FlaconV3Phase } from '../canvas/FlaconRealistic';

/** Aligné sur Preloader court (~1.5s) puis léger buffer. */
const HERO_START_AFTER_MS = 1500;

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const heroActive = useIsInViewport(sectionRef, { initialInViewport: true });
  const { x: mouseX, y: mouseY } = useMousePosition();
  const { latheSegments, isMobile } = useGpuSparkleSettings();
  const [flaconStart, setFlaconStart] = useState<number | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const phaseRef = useRef<FlaconV3Phase>('line');
  const lineLayerRef = useRef<HTMLDivElement>(null);
  const canvasLayerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setReducedMotion(reduced);
    const delay = reduced ? 500 : HERO_START_AFTER_MS;
    const id = window.setTimeout(() => {
      setFlaconStart(performance.now());
    }, delay);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (flaconStart === null || reducedMotion) return;

    let raf = 0;
    let stopped = false;
    const tick = () => {
      if (stopped) return;
      const e = (performance.now() - flaconStart) / 1000;
      const line = lineLayerRef.current;
      const canvas = canvasLayerRef.current;
      if (line) {
        if (e < 1) line.style.opacity = '1';
        else if (e < 1.45) line.style.opacity = String(1 - (e - 1) / 0.45);
        else line.style.opacity = '0';
      }
      if (canvas) {
        if (e < 0.75) canvas.style.opacity = '0';
        else if (e < 1.5) canvas.style.opacity = String((e - 0.75) / 0.75);
        else canvas.style.opacity = '1';
      }
      if (e < 4) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      stopped = true;
      cancelAnimationFrame(raf);
    };
  }, [flaconStart, reducedMotion]);

  useEffect(() => {
    if (flaconStart === null || !reducedMotion) return;
    if (lineLayerRef.current) lineLayerRef.current.style.opacity = '0';
    if (canvasLayerRef.current) canvasLayerRef.current.style.opacity = '1';
  }, [flaconStart, reducedMotion]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100dvh] overflow-hidden bg-noir-profond"
      style={{
        background:
          'radial-gradient(ellipse 75% 60% at 50% 50%, #15110D 0%, #0A0805 78%)',
      }}
    >
      <div className="absolute inset-0 z-[4]">
        {flaconStart !== null && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              ref={canvasLayerRef}
              className="absolute inset-0 transition-none"
              style={{ opacity: reducedMotion ? 1 : 0 }}
            >
              <Suspense fallback={null}>
                <FlaconRealistic
                  startTime={flaconStart}
                  phaseRef={phaseRef}
                  reducedMotion={reducedMotion}
                  active={heroActive}
                  latheSegments={latheSegments}
                  mouseX={mouseX}
                  mouseY={mouseY}
                  cameraFov={isMobile ? 50 : 35}
                />
              </Suspense>
            </div>
            {!reducedMotion && (
              <div
                ref={lineLayerRef}
                className="pointer-events-none relative z-[2] flex h-[min(72vh,520px)] w-[min(42vw,280px)] max-w-[90vw] items-center justify-center text-or-pur transition-none"
                style={{ opacity: 1 }}
              >
                <FlaconLineArt className="h-full w-full max-h-[480px]" />
              </div>
            )}
          </div>
        )}
      </div>

      <div
        className="hero-brume pointer-events-none absolute inset-0 z-[2] mix-blend-soft-light"
        aria-hidden
        style={{
          background: `radial-gradient(ellipse at 25% 75%, rgba(244, 201, 119, 0.08) 0%, transparent 45%),
            radial-gradient(ellipse at 75% 25%, rgba(74, 31, 31, 0.12) 0%, transparent 50%)`,
        }}
      />

      <div className="relative z-[25] flex min-h-[100dvh] flex-col items-center justify-between px-[6vw] pb-[6vh] pt-[12vh] pointer-events-none">
        <p
          className="text-center font-body text-[0.7rem] font-extralight uppercase tracking-[0.5em] text-or-pur"
          style={{ fontWeight: 200 }}
        >
          Parfumerie niche - Bordeaux 2026
        </p>

        <div className="flex flex-col items-center text-center">
          <h1 className="font-display text-[clamp(3.5rem,11vw,8.5rem)] font-light italic leading-none tracking-tight text-ivoire-chaud [text-shadow:0_0_20px_rgba(244,201,119,0.15)]">
            ORIANE
          </h1>
          <p
            className="mt-8 max-w-xl font-body text-[0.95rem] font-light italic tracking-[0.3em] text-or-pale"
            style={{ fontWeight: 300 }}
          >
            Trois aubes. Trois fragrances. Une maison.
          </p>
        </div>

        <p
          className="hero-bob text-center font-body text-[0.65rem] font-extralight uppercase tracking-[0.4em] text-or-pale"
          style={{ fontWeight: 200 }}
        >
          Scroll ↓
        </p>
      </div>
    </section>
  );
}
