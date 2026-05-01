'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { FlaconRealistic, type FlaconV3Phase } from '../canvas/FlaconRealistic';
import { useGpuSparkleSettings } from '../../hooks/useGpuSparkleSettings';
import { useMousePosition } from '../../hooks/useMousePosition';

const LETTERS = 'ORIANE'.split('');

export function Scene1Opening() {
  const [reducedMotion, setRm] = useState(false);
  useEffect(() => {
    setRm(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);
  const { latheSegments, isMobile } = useGpuSparkleSettings();
  const { x: mx, y: my } = useMousePosition();
  const phaseRef = useRef<FlaconV3Phase>('line');
  const [showBlack, setShowBlack] = useState(true);
  const [showTitle, setShowTitle] = useState(false);
  const [flaconStart, setFlaconStart] = useState<number | null>(null);

  useEffect(() => {
    if (reducedMotion) {
      setShowBlack(false);
      setShowTitle(true);
      setFlaconStart(performance.now());
      return;
    }
    const t0 = window.setTimeout(() => setShowBlack(false), 1000);
    const t1 = window.setTimeout(() => setFlaconStart(performance.now()), 1500);
    const t2 = window.setTimeout(() => setShowTitle(true), 3000);
    return () => {
      window.clearTimeout(t0);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [reducedMotion]);

  return (
    <section
      className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden bg-noir-profond"
      aria-label="Ouverture"
    >
      {showBlack && <div className="absolute inset-0 z-[20] bg-noir-profond" aria-hidden />}

      {flaconStart !== null && (
        <div className="absolute inset-0 z-[1] flex items-center justify-center">
          <div className="h-[min(70vh,520px)] w-full max-w-[min(90vw,380px)] opacity-95">
            <Suspense fallback={null}>
              <FlaconRealistic
                startTime={flaconStart}
                phaseRef={phaseRef}
                reducedMotion={reducedMotion}
                active
                latheSegments={latheSegments}
                mouseX={mx}
                mouseY={my}
                cameraFov={isMobile ? 50 : 35}
              />
            </Suspense>
          </div>
        </div>
      )}

      {showTitle && (
        <div className="relative z-[10] flex flex-col items-center px-6 text-center">
          <h1 className="font-display text-[clamp(3rem,12vw,8rem)] font-light italic leading-none tracking-tight text-ivoire-chaud [text-shadow:0_0_24px_rgba(244,201,119,0.12)]">
            {LETTERS.map((ch, i) => (
              <span
                key={i}
                className="inline-block opacity-0 [animation:scene1Letter_0.55s_ease-out_forwards]"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {ch}
              </span>
            ))}
          </h1>
          <p className="mt-6 font-display text-lg font-light italic text-or-pale md:text-xl">
            Une parfumerie.
          </p>
        </div>
      )}

      <p className="pointer-events-none absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-or-pur/30">↓</p>

      <style>{`
        @keyframes scene1Letter {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
