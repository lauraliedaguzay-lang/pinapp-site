'use client';

import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FlaconRevealScene } from '../canvas/FlaconRevealScene';
import { FlaconSVGIllustration } from '../canvas/FlaconSVGIllustration';

gsap.registerPlugin(ScrollTrigger);

export function Scene2Verser() {
  const sectionRef       = useRef<HTMLElement>(null);
  const svgRef           = useRef<HTMLDivElement>(null);
  const canvasRef        = useRef<HTMLDivElement>(null);
  const textRef          = useRef<HTMLDivElement>(null);

  // Deux canaux de progress :
  // progressRef → Canvas (lu en useFrame, zéro re-render)
  // progressState → SVG (nécessite re-render React pour mettre à jour les attributs SVG)
  const progressRef                          = useRef(0);
  const [progressState, setProgressState]    = useState(0);
  const rafPending                           = useRef(false);

  const [mounted, setMounted] = useState(false);

  // ── Mount ──
  useEffect(() => { setMounted(true); }, []);

  // ── GSAP pin + phases ──
  useEffect(() => {
    if (!mounted) return;
    const section = sectionRef.current;
    if (!section) return;

    // SVG visible initialement, Canvas masqué
    gsap.set(canvasRef.current, { opacity: 0 });
    gsap.set(textRef.current,   { opacity: 0, y: 60 });

    const ctx = gsap.context(() => {
      // ── Pin principal 200vh (4 phases × 50vh) ──
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: '+=200%',
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
          // Canvas : mise à jour synchrone (pas de re-render)
          progressRef.current = self.progress;
          // SVG : batché via rAF pour ne pas spammer React
          if (!rafPending.current) {
            rafPending.current = true;
            requestAnimationFrame(() => {
              setProgressState(progressRef.current);
              rafPending.current = false;
            });
          }
        },
      });

      // Phase A → B (0-25%) : SVG disparaît
      gsap.to(svgRef.current, {
        opacity: 0,
        scale: 1.08,
        filter: 'blur(6px)',
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=50%',
          scrub: 1,
        },
      });

      // Phase B → C (25-50%) : Canvas apparaît
      gsap.fromTo(canvasRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: '+=50%',
            end: '+=100%',
            scrub: 1,
          },
        },
      );

      // Texte fade-in (10-40% du pin)
      gsap.fromTo(textRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: '+=20%',
            end: '+=80%',
            scrub: 1,
          },
        },
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
      {/* Phase A : SVG illustration linework */}
      <div
        ref={svgRef}
        className="absolute inset-0 z-10 flex items-center justify-center"
      >
        <FlaconSVGIllustration progress={progressState} />
      </div>

      {/* Phase B-D : Canvas R3F 3D */}
      {mounted && (
        <div ref={canvasRef} className="absolute inset-0 z-0" aria-hidden>
          <FlaconRevealScene progressRef={progressRef} />
        </div>
      )}

      {/* Vignette */}
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

      {/* HTML overlay text */}
      <div
        ref={textRef}
        className="pointer-events-none absolute inset-x-0 bottom-[15%] z-20 flex flex-col items-center px-6 text-center"
      >
        <p
          className="font-display font-light italic leading-relaxed text-ivoire-chaud"
          style={{
            fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
            textShadow: '0 0 40px rgba(244,201,119,0.4)',
          }}
        >
          Capturer l&apos;instant<br />
          où le monde change de couleur.
        </p>
        <div className="mt-10 flex items-center gap-3 text-or-pale/50">
          <span className="h-px w-8 bg-or-pale/40" />
          <span className="font-body text-[0.55rem] uppercase tracking-[0.4em]">Manifeste</span>
          <span className="h-px w-8 bg-or-pale/40" />
        </div>
      </div>
    </section>
  );
}
