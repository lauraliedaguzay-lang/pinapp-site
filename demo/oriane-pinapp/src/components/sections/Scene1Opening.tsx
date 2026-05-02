'use client';

import { useEffect, useRef } from 'react';

// ─────────────────────────────────────────────────────────────
// Constantes DA
// ─────────────────────────────────────────────────────────────
const LETTERS = 'ORIANE'.split('');

// Parallax souris : déplacement max en px à l'extrémité de l'écran
const MOUSE_MAX: readonly number[] = [10, 20, 30, 46, 68, 80, 110];

// Parallax scroll : fraction de vh que la couche descend sur 1 section (100dvh)
// négatif = la couche monte quand on scrolle (effet profondeur)
const SCROLL_FACTOR: readonly number[] = [0.28, 0.34, 0.42, 0.5, 0.6, 0.65, 1.0];

// ─────────────────────────────────────────────────────────────
// Seeded pseudo-random [0, 1)
// ─────────────────────────────────────────────────────────────
function sr(i: number, k: number): number {
  const x = Math.sin((i * 37.3 + k * 4.17 + 1.9) * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

// ─────────────────────────────────────────────────────────────
// Couche 2 — Brumes dorées (grandes taches floues)
// ─────────────────────────────────────────────────────────────
const MISTS = Array.from({ length: 10 }, (_, i) => ({
  left: (5 + sr(i, 0) * 90).toFixed(1),
  top:  (5 + sr(i, 1) * 90).toFixed(1),
  size: Math.round(200 + sr(i, 2) * 350),
  color: (['rgba(244,201,119,0.09)', 'rgba(212,165,116,0.07)', 'rgba(244,228,193,0.06)'] as const)[
    Math.floor(sr(i, 3) * 3)
  ],
  dur:  (12 + sr(i, 4) * 14).toFixed(1),
  del:  (sr(i, 5)  * 9).toFixed(1),
  dx1:  ((sr(i, 6)  - 0.5) * 28).toFixed(0),
  dy1:  ((sr(i, 7)  - 0.5) * 18).toFixed(0),
  dx2:  ((sr(i, 8)  - 0.5) * 28).toFixed(0),
  dy2:  ((sr(i, 9)  - 0.5) * 18).toFixed(0),
  name: `s1mist${i}`,
}));

// ─────────────────────────────────────────────────────────────
// Couche 4 — Paillettes arrière (petites, 100 pièces)
// ─────────────────────────────────────────────────────────────
const SPARKS_BACK = Array.from({ length: 100 }, (_, i) => ({
  left: (sr(i, 10) * 100).toFixed(1),
  top:  (sr(i, 11) * 100).toFixed(1),
  size: (1 + sr(i, 12) * 2).toFixed(1),
  color: (['#F4C977', '#D4A574', '#F4E4C1'] as const)[Math.floor(sr(i, 13) * 3)],
  dur:  (8  + sr(i, 14) * 10).toFixed(1),
  del:  (sr(i, 15) * 12).toFixed(1),
  name: `s1sb${i}`,
}));

// ─────────────────────────────────────────────────────────────
// Couche 7 — Paillettes premier plan (plus grosses, 36 pièces)
// ─────────────────────────────────────────────────────────────
const SPARKS_FRONT = Array.from({ length: 36 }, (_, i) => ({
  left:  (sr(i, 20) * 100).toFixed(1),
  top:   (sr(i, 21) * 100).toFixed(1),
  size:  (2.5 + sr(i, 22) * 4).toFixed(1),
  color: (['#F4C977', '#D4A574', '#F4E4C1', '#F4C977'] as const)[Math.floor(sr(i, 23) * 4)],
  dur:   (4  + sr(i, 24) * 6).toFixed(1),
  del:   (sr(i, 25) * 8).toFixed(1),
  name:  `s1sf${i}`,
}));

// ─────────────────────────────────────────────────────────────
// Générer les @keyframes comme une chaîne statique
// ─────────────────────────────────────────────────────────────
const KEYFRAMES = [
  // Brumes
  ...MISTS.map(
    (m) => `@keyframes ${m.name} {
      0%,100% { transform:translate(0px,0px) scale(1); opacity:.55; }
      33%     { transform:translate(${m.dx1}px,${m.dy1}px) scale(1.07); opacity:.82; }
      66%     { transform:translate(${m.dx2}px,${m.dy2}px) scale(.95); opacity:.38; }
    }`,
  ),
  // Paillettes arrière
  ...SPARKS_BACK.map(
    (s) => `@keyframes ${s.name} {
      0%   { opacity:0;    transform:translateY(0px)   scale(.6); }
      20%  { opacity:.75; }
      60%  { opacity:.45; transform:translateY(-18px) scale(1); }
      100% { opacity:0;    transform:translateY(-36px) scale(.4); }
    }`,
  ),
  // Paillettes avant
  ...SPARKS_FRONT.map(
    (s) => `@keyframes ${s.name} {
      0%   { opacity:0;    transform:translateY(0px)   scale(.5); }
      18%  { opacity:.9; }
      55%  { opacity:.55; transform:translateY(-24px) scale(1); }
      100% { opacity:0;    transform:translateY(-50px) scale(.35); }
    }`,
  ),
  // Halos pulse (partagés)
  `@keyframes s1halo0 { 0%,100%{transform:scale(.95);opacity:.28;} 50%{transform:scale(1.04);opacity:.52;} }`,
  `@keyframes s1halo1 { 0%,100%{transform:scale(1.02);opacity:.18;} 50%{transform:scale(.97);opacity:.42;} }`,
  `@keyframes s1halo2 { 0%,100%{transform:scale(.97);opacity:.22;} 50%{transform:scale(1.05);opacity:.45;} }`,
  `@keyframes s1halo3 { 0%,100%{transform:scale(1.03);opacity:.15;} 50%{transform:scale(.95);opacity:.38;} }`,
  // Entrée lettres
  `@keyframes s1letterIn {
    from { opacity:0; transform:translateY(20px) scale(.9); filter:blur(5px); }
    to   { opacity:1; transform:translateY(0px)  scale(1);  filter:blur(0px); }
  }`,
  // Tagline
  `@keyframes s1tagFade {
    from { opacity:0; transform:translateY(12px); }
    to   { opacity:1; transform:translateY(0px); }
  }`,
  // Scroll hint
  `@keyframes s1hint {
    0%,100% { transform:translate(-50%,0px); opacity:.55; }
    50%     { transform:translate(-50%,7px); opacity:.9; }
  }`,
  // Grain pulse
  `@keyframes s1grain {
    0%,100% { opacity:.025; }
    50%     { opacity:.045; }
  }`,
  // Reduced motion: désactive toutes les animations couteuses
  `@media (prefers-reduced-motion:reduce) {
    .s1-mist,.s1-spark,.s1-halo { animation:none !important; opacity:.5 !important; }
  }`,
].join('\n');

// ─────────────────────────────────────────────────────────────
// Composant principal
// ─────────────────────────────────────────────────────────────
export function Scene1Opening() {
  const sectionRef = useRef<HTMLElement>(null);

  // Un ref par couche (ordre = MOUSE_MAX / SCROLL_FACTOR)
  const bgRef        = useRef<HTMLDivElement>(null); // 0
  const brumeRef     = useRef<HTMLDivElement>(null); // 1
  const halosRef     = useRef<HTMLDivElement>(null); // 2
  const sparkBRef    = useRef<HTMLDivElement>(null); // 3
  const titleRef     = useRef<HTMLDivElement>(null); // 4
  const taglineRef   = useRef<HTMLDivElement>(null); // 5
  const sparkFRef    = useRef<HTMLDivElement>(null); // 6

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const layers = [bgRef, brumeRef, halosRef, sparkBRef, titleRef, taglineRef, sparkFRef];

    if (rm) {
      // Mode sobre : pas de parallax, tout visible
      layers.forEach((r) => {
        if (r.current) r.current.style.transform = 'translate3d(0,0,0)';
      });
      return;
    }

    // ── État lerp souris ────────────────────────────────────
    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;
    let rafId = 0;

    const LERP = 0.065;

    const onMouseMove = (e: MouseEvent) => {
      targetX = (e.clientX / window.innerWidth  - 0.5) * 2; // -1 → +1
      targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    const onMouseLeave = () => { targetX = 0; targetY = 0; };

    // ── rAF loop unique : mouse + scroll en un seul translate3d ─
    const tick = () => {
      currentX += (targetX - currentX) * LERP;
      currentY += (targetY - currentY) * LERP;

      // Scroll normalisé : 0 = top du hero, 1 = bottom du hero
      const rect = section.getBoundingClientRect();
      const scrollNorm = Math.max(0, Math.min(1, -rect.top / window.innerHeight));

      // Fade-out hero après 50% de scroll
      const alpha = scrollNorm < 0.5 ? 1 : Math.max(0, 1 - (scrollNorm - 0.5) * 2.2);
      section.style.opacity = alpha.toFixed(3);

      layers.forEach((ref, i) => {
        const el = ref.current;
        if (!el) return;
        const mx = currentX * MOUSE_MAX[i]!;
        const my = currentY * MOUSE_MAX[i]!;
        // scroll : descend proportionnellement selon le facteur
        const sy = -scrollNorm * SCROLL_FACTOR[i]! * window.innerHeight;
        el.style.transform = `translate3d(${mx.toFixed(2)}px,${(my + sy).toFixed(2)}px,0)`;
      });

      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    section.addEventListener('mouseleave', onMouseLeave, { passive: true });
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      section.removeEventListener('mouseleave', onMouseLeave);
      cancelAnimationFrame(rafId);
      section.style.opacity = '1';
      layers.forEach((r) => { if (r.current) r.current.style.transform = ''; });
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden bg-[#0A0805]"
      aria-label="Ouverture Maison ORIANE"
    >
      <style>{KEYFRAMES}</style>

      {/* ── Couche 1 — Background atmosphère ── */}
      <div
        ref={bgRef}
        className="absolute inset-0 will-change-transform"
        style={{ zIndex: 1 }}
        aria-hidden
      >
        {/* Gradient principal */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 80% 70% at 50% 42%, rgba(74,31,31,0.38) 0%, rgba(20,10,5,0.88) 52%, #0A0805 80%)',
          }}
        />
        {/* Grain SVG pulsant */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: '220px 220px',
            animation: 's1grain 5s ease-in-out infinite',
          }}
        />
      </div>

      {/* ── Couche 2 — Brumes dorées ── */}
      <div
        ref={brumeRef}
        className="pointer-events-none absolute inset-0 will-change-transform"
        style={{ zIndex: 2 }}
        aria-hidden
      >
        {MISTS.map((m) => (
          <div
            key={m.name}
            className="s1-mist absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              left: `${m.left}%`,
              top: `${m.top}%`,
              width: m.size,
              height: m.size,
              background: `radial-gradient(ellipse at center, ${m.color} 0%, transparent 70%)`,
              filter: 'blur(32px)',
              animationName: m.name,
              animationDuration: `${m.dur}s`,
              animationDelay: `${m.del}s`,
              animationTimingFunction: 'ease-in-out',
              animationIterationCount: 'infinite',
            }}
          />
        ))}
      </div>

      {/* ── Couche 3 — Halos lumineux ── */}
      <div
        ref={halosRef}
        className="pointer-events-none absolute inset-0 will-change-transform"
        style={{ zIndex: 3 }}
        aria-hidden
      >
        {([
          { w: 420,  l: '32%', t: '38%', dur: 6.5, del: 0   },
          { w: 660,  l: '62%', t: '55%', dur: 8,   del: 1.4 },
          { w: 880,  l: '44%', t: '50%', dur: 5.5, del: 2.8 },
          { w: 1080, l: '54%', t: '42%', dur: 7.2, del: 0.8 },
        ] as const).map(({ w, l, t, dur, del }, i) => (
          <div
            key={i}
            className="s1-halo absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              left: l,
              top: t,
              width: w,
              height: w,
              background: `radial-gradient(ellipse at center, rgba(244,201,119,0.22) 0%, rgba(212,165,116,0.1) 35%, transparent 70%)`,
              animationName: `s1halo${i}`,
              animationDuration: `${dur}s`,
              animationDelay: `${del}s`,
              animationTimingFunction: 'ease-in-out',
              animationIterationCount: 'infinite',
            }}
          />
        ))}
      </div>

      {/* ── Couche 4 — Paillettes arrière ── */}
      <div
        ref={sparkBRef}
        className="pointer-events-none absolute inset-0 will-change-transform"
        style={{ zIndex: 4 }}
        aria-hidden
      >
        {SPARKS_BACK.map((s) => (
          <div
            key={s.name}
            className="s1-spark absolute rounded-full"
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              background: s.color,
              boxShadow: `0 0 4px 1px ${s.color}88`,
              animationName: s.name,
              animationDuration: `${s.dur}s`,
              animationDelay: `${s.del}s`,
              animationTimingFunction: 'ease-in-out',
              animationIterationCount: 'infinite',
              opacity: 0,
            }}
          />
        ))}
      </div>

      {/* ── Couche 5 — Titre ORIANE ── */}
      <div
        ref={titleRef}
        className="pointer-events-none absolute inset-0 flex items-center justify-center will-change-transform"
        style={{ zIndex: 10 }}
      >
        <h1
          className="flex flex-wrap justify-center font-display font-light italic leading-none tracking-tight text-ivoire-chaud"
          style={{
            fontSize: 'clamp(4.5rem, 14vw, 12rem)',
            fontWeight: 300,
            textShadow: [
              '0 0 15px rgba(244,201,119,0.7)',
              '0 0 40px rgba(244,201,119,0.45)',
              '0 0 80px rgba(244,201,119,0.25)',
              '0 0 160px rgba(212,165,116,0.12)',
            ].join(', '),
          }}
        >
          {LETTERS.map((ch, i) => (
            <span
              key={i}
              className="inline-block"
              style={{
                animation: `s1letterIn 900ms cubic-bezier(0.22,1,0.36,1) ${i * 80}ms both`,
              }}
            >
              {ch}
            </span>
          ))}
        </h1>
      </div>

      {/* ── Couche 6 — Tagline + ornement ── */}
      <div
        ref={taglineRef}
        className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center will-change-transform"
        style={{ zIndex: 11 }}
      >
        {/* Décalage vertical : en-dessous du titre */}
        <div
          style={{ marginTop: 'clamp(6rem, 16vw, 13.5rem)' }}
        >
          <div
            className="mx-auto mb-3 flex items-center justify-center gap-3"
            style={{ animation: 's1tagFade 700ms ease-out 820ms both' }}
          >
            <div className="h-px w-7 opacity-50" style={{ background: '#D4A574' }} />
            <span
              className="font-body uppercase"
              style={{ fontSize: '0.52rem', letterSpacing: '0.55em', color: '#D4A574', fontWeight: 200, opacity: 0.55 }}
            >
              Bordeaux 2026
            </span>
            <div className="h-px w-7 opacity-50" style={{ background: '#D4A574' }} />
          </div>
          <p
            className="text-center font-display italic"
            style={{
              fontSize: '1rem',
              fontWeight: 200,
              letterSpacing: '0.14em',
              color: '#F4E4C1',
              animation: 's1tagFade 700ms ease-out 960ms both',
            }}
          >
            Une parfumerie.
          </p>
        </div>
      </div>

      {/* ── Couche 7 — Paillettes premier plan ── */}
      <div
        ref={sparkFRef}
        className="pointer-events-none absolute inset-0 will-change-transform"
        style={{ zIndex: 15 }}
        aria-hidden
      >
        {SPARKS_FRONT.map((s) => (
          <div
            key={s.name}
            className="s1-spark absolute rounded-full"
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              background: s.color,
              boxShadow: `0 0 6px 2px ${s.color}aa`,
              animationName: s.name,
              animationDuration: `${s.dur}s`,
              animationDelay: `${s.del}s`,
              animationTimingFunction: 'ease-in-out',
              animationIterationCount: 'infinite',
              opacity: 0,
            }}
          />
        ))}
      </div>

      {/* ── Couche 8 — Scroll indicator ── */}
      <div
        className="pointer-events-none absolute bottom-[4.5vh] left-1/2 z-[20]"
        aria-hidden
        style={{ animation: 's1hint 2.6s ease-in-out 1.4s infinite' }}
      >
        <p
          className="font-body uppercase"
          style={{
            fontSize: '0.65rem',
            fontWeight: 200,
            letterSpacing: '0.52em',
            color: 'rgba(244,228,193,0.38)',
          }}
        >
          SCROLL ↓
        </p>
      </div>
    </section>
  );
}
