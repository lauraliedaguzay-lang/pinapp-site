'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect, useRef, useState } from 'react';
import { FlaconRealisticScene, type FlaconV3Phase } from '../canvas/FlaconRealistic';
import { Scene1Drop } from '../canvas/Scene1Drop';
import { useGpuSparkleSettings } from '../../hooks/useGpuSparkleSettings';
import { useMousePosition } from '../../hooks/useMousePosition';

const LETTERS = 'ORIANE'.split('');

/**
 * Architecture : un seul Canvas R3F (pas de Canvas dupliqué avec FlaconRealistic).
 * `Scene1Drop` + `FlaconRealisticScene` partagent la même timeline `sceneEpochMs`.
 */
export function Scene1Opening() {
  const [reducedMotion, setRm] = useState(false);
  const [sceneEpochMs, setSceneEpochMs] = useState<number | null>(null);
  const [blackOverlay, setBlackOverlay] = useState(true);
  const [showTitle, setShowTitle] = useState(false);
  const [showTagline, setShowTagline] = useState(false);

  const phaseRef = useRef<FlaconV3Phase>('line');
  const { latheSegments, isMobile } = useGpuSparkleSettings();
  const { x: mx, y: my } = useMousePosition();

  useEffect(() => {
    const rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setRm(rm);
    const epoch = performance.now();
    setSceneEpochMs(epoch);

    if (rm) {
      setBlackOverlay(false);
      setShowTitle(true);
      setShowTagline(true);
      return;
    }

    const tBlack = window.setTimeout(() => setBlackOverlay(false), 1000);
    const tTitle = window.setTimeout(() => setShowTitle(true), 3000);
    const tTag = window.setTimeout(() => setShowTagline(true), 4000);
    return () => {
      window.clearTimeout(tBlack);
      window.clearTimeout(tTitle);
      window.clearTimeout(tTag);
    };
  }, []);

  return (
    <section
      className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-x-clip bg-[#0A0805]"
      aria-label="Ouverture"
    >
      {blackOverlay && (
        <div className="pointer-events-none absolute inset-0 z-[20] bg-[#0A0805]" aria-hidden />
      )}

      {sceneEpochMs !== null && (
        <div className="absolute inset-0 z-[1] flex items-center justify-center">
          <div className="h-[min(70vh,520px)] w-full max-w-[min(90vw,380px)]">
            <Canvas
              className="h-full w-full touch-none"
              gl={{ alpha: true, antialias: true, localClippingEnabled: true }}
              dpr={[1, 2]}
              frameloop="always"
            >
              <Suspense fallback={null}>
                {!reducedMotion && (
                  <Scene1Drop sceneEpochMs={sceneEpochMs} reducedMotion={reducedMotion} />
                )}
                <FlaconRealisticScene
                  startTime={sceneEpochMs}
                  phaseRef={phaseRef}
                  reducedMotion={reducedMotion}
                  active
                  latheSegments={latheSegments}
                  mouseX={mx}
                  mouseY={my}
                  cameraFov={isMobile ? 50 : 35}
                  narrativeVariant="scene1"
                />
              </Suspense>
            </Canvas>
          </div>
        </div>
      )}

      {showTitle && (
        <div className="pointer-events-none absolute inset-0 z-[10] flex flex-col items-center justify-center px-4 text-center sm:px-8 md:px-12">
          <h1
            className="font-display inline-flex max-w-[min(100%,calc(100vw-2rem))] flex-wrap justify-center font-light italic leading-none tracking-tight text-ivoire-chaud"
            style={{
              fontSize: 'clamp(5rem, 10vw, 10rem)',
              fontWeight: 300,
              textShadow:
                '0 0 30px rgba(244, 201, 119, 0.3), 0 0 60px rgba(244, 201, 119, 0.15)',
            }}
          >
            {LETTERS.map((ch, i) => (
              <span
                key={i}
                className={`inline-block ${reducedMotion ? 'opacity-100' : 'opacity-0 [animation-fill-mode:forwards]'}`}
                style={
                  reducedMotion
                    ? undefined
                    : {
                        animationName: 'scene1LetterIn',
                        animationDuration: '400ms',
                        animationTimingFunction: 'cubic-bezier(0.65, 0, 0.35, 1)',
                        animationDelay: `${i * 80}ms`,
                      }
                }
              >
                {ch}
              </span>
            ))}
          </h1>
          {showTagline && (
            <p
              className={`mt-6 font-display italic text-or-pale ${reducedMotion ? 'opacity-100' : 'opacity-0'}`}
              style={{
                fontSize: '1rem',
                fontWeight: 200,
                letterSpacing: '0.1em',
                ...(reducedMotion ? {} : { animation: 'scene1TaglineFade 600ms ease-out forwards' }),
              }}
            >
              Une parfumerie.
            </p>
          )}
        </div>
      )}

      {!reducedMotion && (
        <p
          className="pointer-events-none absolute bottom-[4vh] left-1/2 z-[10] -translate-x-1/2 font-body text-[0.7rem] font-extralight uppercase tracking-[0.5em] [animation:scene1ScrollHint_2.8s_ease-in-out_infinite]"
          style={{ fontWeight: 200, color: 'rgba(244, 228, 193, 0.4)' }}
        >
          SCROLL ↓
        </p>
      )}

      <style>{`
        @keyframes scene1LetterIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scene1TaglineFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scene1ScrollHint {
          0%, 100% { transform: translate(-50%, 0); }
          50% { transform: translate(-50%, 5px); }
        }
      `}</style>
    </section>
  );
}
