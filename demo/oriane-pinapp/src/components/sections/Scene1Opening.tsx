'use client';

import { useState, useEffect, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { HeroCanvas } from '../canvas/HeroCanvas';

gsap.registerPlugin(ScrollTrigger, SplitText);

// ─── Section principale ───────────────────────────────────────────────────────
export function Scene1Opening() {
  const sectionRef     = useRef<HTMLElement>(null);
  const overlayRef     = useRef<HTMLDivElement>(null);
  const titleRef       = useRef<HTMLHeadingElement>(null);
  const taglineRef     = useRef<HTMLParagraphElement>(null);
  const scrollHintRef  = useRef<HTMLDivElement>(null);
  const ornementRef    = useRef<HTMLDivElement>(null);
  const scrollProgress = useRef(0);
  const mouseX         = useRef(0);
  const mouseY         = useRef(0);

  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // ── Mount ──
  useEffect(() => {
    setMounted(true);
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    const mq = window.matchMedia('(max-width: 768px)');
    setIsMobile(mq.matches);
    const onMq = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', onMq);
    return () => mq.removeEventListener('change', onMq);
  }, []);

  // ── Scroll tracking ──
  useEffect(() => {
    if (!mounted) return;
    const section = sectionRef.current;
    if (!section) return;
    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      scrollProgress.current = Math.max(0, Math.min(1, -rect.top / window.innerHeight));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [mounted]);

  // ── Mouse tracking ──
  useEffect(() => {
    if (!mounted) return;
    const onMouse = (e: MouseEvent) => {
      mouseX.current =  (e.clientY / window.innerHeight - 0.5) * 2;
      mouseY.current =  (e.clientX / window.innerWidth  - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouse);
    return () => window.removeEventListener('mousemove', onMouse);
  }, [mounted]);

  // ── GSAP intro — SplitText letter stagger (pattern adrianhajdin/iphone) ──
  useGSAP(() => {
    if (!mounted || reducedMotion) return;

    const title    = titleRef.current;
    const tagline  = taglineRef.current;
    const hint     = scrollHintRef.current;
    const ornement = ornementRef.current;
    if (!title || !tagline || !hint || !ornement) return;

    // SplitText — chaque lettre du titre animée
    const split = SplitText.create(title, { type: 'chars' });

    gsap.set(split.chars, { opacity: 0, yPercent: 110, rotateX: -80 });
    gsap.set(tagline,  { opacity: 0, y: 22 });
    gsap.set(ornement, { opacity: 0, scaleX: 0 });
    gsap.set(hint,     { opacity: 0 });

    const tl = gsap.timeline({ delay: 0.35 });

    tl.to(split.chars, {
      opacity: 1,
      yPercent: 0,
      rotateX: 0,
      stagger: 0.045,
      duration: 1.1,
      ease: 'power3.out',
    }, 0);

    tl.to(ornement, {
      opacity: 1,
      scaleX: 1,
      duration: 0.7,
      ease: 'power2.out',
    }, 0.55);

    tl.to(tagline, {
      opacity: 1,
      y: 0,
      duration: 0.95,
      ease: 'power2.out',
    }, 0.72);

    tl.to(hint, {
      opacity: 1,
      duration: 0.7,
      ease: 'power2.out',
    }, 1.35);

    return () => split.revert();
  }, { dependencies: [mounted, reducedMotion], scope: overlayRef });

  // ── Fallback visible immédiatement si reduced-motion ──
  useEffect(() => {
    if (!mounted || !reducedMotion) return;
    const els = [titleRef.current, taglineRef.current, scrollHintRef.current, ornementRef.current];
    els.forEach(el => {
      if (el) el.style.opacity = '1';
    });
  }, [mounted, reducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="scene-1"
      className="relative h-[100dvh] w-full overflow-hidden bg-[#060101]"
      aria-label="Maison ORIANE — Ouverture"
    >
      {/* ─── Canvas 3D ─── */}
      {mounted && !reducedMotion && (
        <div className="absolute inset-0 z-0" aria-hidden>
          <HeroCanvas
            isMobile={isMobile}
            scrollProgress={scrollProgress}
            mouseX={mouseX}
            mouseY={mouseY}
          />
        </div>
      )}

      {/* ─── Fond statique (SSR + reduced-motion) ─── */}
      {(!mounted || reducedMotion) && (
        <div
          className="absolute inset-0 z-0"
          style={{
            background: 'radial-gradient(ellipse 80% 70% at 50% 44%, #260808 0%, #0D0303 42%, #040101 100%)',
          }}
          aria-hidden
        />
      )}

      {/* ─── Gradient bas — fondu vers la scène suivante ─── */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 h-52"
        style={{ background: 'linear-gradient(to bottom, transparent, #040101)' }}
        aria-hidden
      />

      {/* ─── HTML overlay ─── */}
      <div
        ref={overlayRef}
        className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center"
        style={{ perspective: '800px' }}
      >
        {/* Surtitle */}
        <p
          className="mb-6 font-body text-[0.52rem] font-light uppercase tracking-[0.6em] text-or-pale/55"
        >
          Bordeaux · 2026
        </p>

        {/* Titre principal — SplitText appliqué ici */}
        <h1
          ref={titleRef}
          className="relative select-none font-display font-extralight uppercase leading-none text-or-liquide"
          style={{
            fontSize: 'clamp(4.5rem, 13.5vw, 11.5rem)',
            letterSpacing: '0.24em',
            mixBlendMode: 'screen',
            textShadow: [
              '0 0 55px rgba(212,169,106,0.65)',
              '0 0 110px rgba(212,169,106,0.28)',
              '0 0 220px rgba(180,100,60,0.15)',
              '0 2px 8px rgba(0,0,0,0.7)',
            ].join(', '),
          }}
        >
          ORIANE
        </h1>

        {/* Ornement ligne — scaleX animé */}
        <div
          ref={ornementRef}
          className="my-5 flex items-center gap-3.5"
          style={{ opacity: 0, transformOrigin: 'center' }}
          aria-hidden
        >
          <div className="h-px w-14 bg-gradient-to-r from-transparent via-or-pale/50 to-or-pale/20" />
          <div className="flex gap-1.5">
            <span className="block h-[2.5px] w-[2.5px] rounded-full bg-or-pale/60" />
            <span className="block h-[2.5px] w-[2.5px] rounded-full bg-or-pur/80" />
            <span className="block h-[2.5px] w-[2.5px] rounded-full bg-or-pale/60" />
          </div>
          <div className="h-px w-14 bg-gradient-to-l from-transparent via-or-pale/50 to-or-pale/20" />
        </div>

        {/* Tagline */}
        <p
          ref={taglineRef}
          className="font-body font-extralight uppercase text-or-pale"
          style={{
            fontSize: 'clamp(0.55rem, 1.3vw, 0.78rem)',
            letterSpacing: '0.52em',
            opacity: 0,
            mixBlendMode: 'screen',
            textShadow: '0 0 18px rgba(212,169,106,0.30)',
          }}
        >
          Une parfumerie.
        </p>
      </div>

      {/* ─── Scroll hint ─── */}
      <div
        ref={scrollHintRef}
        className="pointer-events-none absolute bottom-7 left-1/2 z-20 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ opacity: 0 }}
        aria-hidden
      >
        <span className="font-body text-[0.45rem] uppercase tracking-[0.5em] text-or-pale/35">
          Scroll
        </span>
        <div
          className="h-9 w-px bg-gradient-to-b from-or-pale/30 to-transparent"
          style={{ animation: 'scrollPulse 2.2s ease-in-out infinite' }}
        />
      </div>

      <style>{`
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.25; transform: scaleY(1); transform-origin: top; }
          50%       { opacity: 0.75; transform: scaleY(1.35); transform-origin: top; }
        }
      `}</style>
    </section>
  );
}
