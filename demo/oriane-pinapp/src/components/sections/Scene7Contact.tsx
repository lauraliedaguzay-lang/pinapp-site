'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/** Flacon SVG silhouette plein écran en fond */
function FlaconSilhouette() {
  return (
    <div
      className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
      aria-hidden
    >
      <svg
        viewBox="0 0 160 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-[90vh] max-h-[700px] w-auto opacity-[0.04]"
      >
        {/* Corps */}
        <path
          d="M80 300 C40 300 20 270 18 230 L12 80 C10 50 30 30 50 28 L50 12 C50 6 58 2 80 2 C102 2 110 6 110 12 L110 28 C130 30 150 50 148 80 L142 230 C140 270 120 300 80 300Z"
          stroke="#D4A574"
          strokeWidth="2"
          fill="rgba(212,165,116,0.04)"
        />
        {/* Capuchon */}
        <rect x="56" y="0" width="48" height="18" rx="5" stroke="#D4A574" strokeWidth="1.5" fill="rgba(212,165,116,0.08)" />
        {/* Liquide */}
        <path
          d="M22 200 C22 240 42 290 80 290 C118 290 138 240 138 200 L142 80 C130 62 110 55 80 55 C50 55 30 62 18 80Z"
          fill="rgba(244,201,119,0.06)"
        />
      </svg>
    </div>
  );
}

/** Halos pulsants en fond */
function PulseHalos() {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden" aria-hidden>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: `${280 + i * 180}px`,
            height: `${280 + i * 180}px`,
            border: '1px solid rgba(212,165,116,0.08)',
            animation: `s7pulse ${4 + i * 1.5}s ease-in-out ${i * 0.8}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes s7pulse {
          0%,100% { transform: scale(0.95); opacity: 0.5; }
          50%      { transform: scale(1.04); opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes s7pulse { 0%,100% { transform: scale(1); } }
        }
      `}</style>
    </div>
  );
}

export function Scene7Contact() {
  const wrapRef = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const priceRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrap,
          start: 'top 70%',
          once: true,
        },
      });
      tl.fromTo(headRef.current, { opacity: 0, y: 28, filter: 'blur(5px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.1, ease: 'power2.out' }, 0);
      tl.fromTo(subRef.current, { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' }, 0.45);
      tl.fromTo(ctaRef.current, { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, 0.75);
      tl.fromTo(priceRef.current, { opacity: 0 },
        { opacity: 1, duration: 0.6, ease: 'none' }, 1.1);
    }, wrap);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={wrapRef}
      id="contact"
      className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden bg-noir-profond px-[6vw] py-[18vh] text-center"
    >
      {/* Fond bordeaux subtil */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 55%, rgba(74,31,31,0.32) 0%, rgba(74,31,31,0.08) 42%, transparent 65%)',
        }}
        aria-hidden
      />

      <FlaconSilhouette />
      <PulseHalos />

      <div className="relative z-[10] max-w-[640px]">
        <p
          className="mb-6 font-body text-[0.68rem] font-extralight uppercase tracking-[0.55em] text-or-pur"
          style={{ fontWeight: 200 }}
        >
          — Sur devis exclusif
        </p>

        <h2
          ref={headRef}
          className="mb-8 font-display text-[clamp(2.2rem,5.5vw,4.25rem)] font-light italic leading-tight text-ivoire-chaud"
          style={{
            opacity: 0,
            textShadow: '0 0 40px rgba(244,201,119,0.12)',
          }}
        >
          Composer une fragrance privée.
        </h2>

        <p
          ref={subRef}
          className="mb-12 font-body text-[1rem] font-light leading-relaxed text-ivoire-soft"
          style={{ opacity: 0 }}
        >
          Maison ORIANE accompagne quelques projets par an.
          <br />
          Chaque création est unique, confidentielle.
        </p>

        <div ref={ctaRef} style={{ opacity: 0 }}>
          <a
            href="mailto:contact@maisonoriane.example?subject=Cr%C3%A9ation%20fragrance%20priv%C3%A9e"
            className="group inline-flex min-w-[min(100%,22rem)] items-center justify-center px-12 py-5 font-body text-[0.75rem] font-extralight uppercase tracking-[0.55em] no-underline transition-all duration-400"
            style={{
              fontWeight: 200,
              color: '#D4A574',
              border: '1px solid rgba(212,165,116,0.6)',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = '#4a1f1f';
              (e.currentTarget as HTMLElement).style.color = '#F0E5D0';
              (e.currentTarget as HTMLElement).style.borderColor = '#4a1f1f';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'transparent';
              (e.currentTarget as HTMLElement).style.color = '#D4A574';
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(212,165,116,0.6)';
            }}
            rel="noopener"
          >
            Prendre contact →
          </a>
        </div>

        <p
          ref={priceRef}
          className="mt-10 font-display text-[1rem] font-light italic text-or-pale"
          style={{ opacity: 0 }}
        >
          À partir de 8 000 € HT
        </p>
      </div>
    </section>
  );
}
