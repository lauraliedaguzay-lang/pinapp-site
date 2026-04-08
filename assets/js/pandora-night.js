/* PINAPP — pandora-night.js — v6 DANCE
   Canvas aurora bioluminescente — chorégraphie Pandora
   Couches orbs (6) + Micro-particules danse Lissajous (30)
   Tempo : The Light Always Returns — 3.5s / 7s / 14s
   --------------------------------------------------------- */

const PandoraNight = {
  canvas: null,
  ctx: null,
  t: 0,
  raf: null,
  active: false,
  _scale: 1,
  paused: false,

  /* ── 6 grandes nappes bioluminescentes ─────────────────── */
  layers: [
    {
      cx: 0.15,
      cy: 0.65,
      rx: 0.42,
      ry: 0.32,
      r: 0,
      g: 160,
      b: 210,
      a: 0.32,
      vx: 0.00018,
      vy: 0.00014,
      pw: 0.00008,
      pa: 0.06,
    },
    {
      cx: 0.5,
      cy: 0.4,
      rx: 0.38,
      ry: 0.28,
      r: 0,
      g: 210,
      b: 170,
      a: 0.28,
      vx: -0.00015,
      vy: 0.00012,
      pw: 0.0001,
      pa: 0.05,
    },
    {
      cx: 0.8,
      cy: 0.28,
      rx: 0.4,
      ry: 0.3,
      r: 90,
      g: 10,
      b: 150,
      a: 0.22,
      vx: 0.00012,
      vy: -0.00016,
      pw: 0.00006,
      pa: 0.04,
    },
    {
      cx: 0.22,
      cy: 0.2,
      rx: 0.32,
      ry: 0.24,
      r: 140,
      g: 40,
      b: 220,
      a: 0.18,
      vx: -0.0001,
      vy: 0.00012,
      pw: 0.00007,
      pa: 0.03,
    },
    {
      cx: 0.88,
      cy: 0.72,
      rx: 0.2,
      ry: 0.15,
      r: 255,
      g: 180,
      b: 40,
      a: 0.14,
      vx: 0.00008,
      vy: -0.0001,
      pw: 0.00012,
      pa: 0.04,
    },
    {
      cx: 0.45,
      cy: 0.88,
      rx: 0.28,
      ry: 0.2,
      r: 0,
      g: 200,
      b: 120,
      a: 0.16,
      vx: 0.00014,
      vy: 0.00008,
      pw: 0.00009,
      pa: 0.05,
    },
  ],

  /* ── Micro-particules danse ─────────────────────────────── */
  /* Chaque particule suit un chemin sinusoïdal composé (Lissajous)
     x(t) = bx + Ax·sin(fx·t + φx)
     y(t) = by + Ay·sin(fy·t + φy) + drift·t   (derive vers le haut) */
  particles: [],
  _buildParticles(isMobile) {
    const count = isMobile ? 14 : 30;
    const palette = [
      { r: 0, g: 229, b: 204, name: 'teal' }, // cyan pandora
      { r: 123, g: 79, b: 232, name: 'violet' }, // violet na'vi
      { r: 57, g: 224, b: 117, name: 'green' }, // vert forêt
      { r: 0, g: 180, b: 216, name: 'ice' }, // bleu glace
      { r: 255, g: 195, b: 75, name: 'amber' }, // ambre champignons
    ];
    this.particles = [];
    for (let i = 0; i < count; i++) {
      const col = palette[i % palette.length];
      // Position de départ répartie sur l'écran
      const bx = 0.05 + Math.random() * 0.9;
      const by = 0.1 + Math.random() * 0.9;
      this.particles.push({
        bx,
        by,
        /* Amplitude en fraction de l'écran */
        Ax: (0.04 + Math.random() * 0.09) * (Math.random() < 0.5 ? 1 : -1),
        Ay: 0.03 + Math.random() * 0.07,
        /* Fréquences — ratios Lissajous simples : 1:1, 1:2, 2:3, 3:4 */
        fx: 0.0003 + Math.random() * 0.0006,
        fy: 0.0004 + Math.random() * 0.0007,
        /* Phase décalée pour la "polyphonie" */
        px: Math.random() * Math.PI * 2,
        py: Math.random() * Math.PI * 2,
        /* Dérive verticale douce (remonte lentement) */
        drift: -(0.000012 + Math.random() * 0.00002),
        /* Durée de vie avant réapparition */
        life: 0,
        lifeMax: (400 + Math.random() * 600) | 0,
        /* Taille et couleur */
        size: isMobile ? 1.2 + Math.random() * 1.8 : 1.5 + Math.random() * 2.5,
        r: col.r,
        g: col.g,
        b: col.b,
        /* Opacité de base et pulsation */
        a: 0.5 + Math.random() * 0.45,
        pw: 0.0008 + Math.random() * 0.0014,
        /* Traîne (trail) — longueur en frames */
        trail: isMobile ? [] : new Array(Math.floor(3 + Math.random() * 5)).fill({ x: 0, y: 0 }),
      });
    }
  },

  init() {
    /* Désactivé : l'utilisateur ne veut plus voir de halo/cercle lumineux mouvant en mode nuit.
       On conserve la texture (photo Pandora) + spores/étoiles DOM (pandora-world.js/css). */
    return;
    if (this.canvas) return;
    const isMobile = window.innerWidth < 768;
    this._scale = isMobile ? 0.5 : 1;

    this.canvas = document.createElement('canvas');
    this.canvas.id = 'pandora-canvas';
    this.canvas.style.cssText =
      'position:fixed;inset:0;z-index:0;pointer-events:none;' +
      'mix-blend-mode:screen;will-change:opacity;transition:opacity 800ms ease;';
    document.body.prepend(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    this.active = true;

    if (isMobile) this.layers = this.layers.slice(0, 4);
    this._buildParticles(isMobile);

    const resize = () => {
      const s = this._scale;
      this.canvas.width = Math.round(window.innerWidth * s);
      this.canvas.height = Math.round(window.innerHeight * s);
      this.canvas.style.width = window.innerWidth + 'px';
      this.canvas.style.height = window.innerHeight + 'px';
    };
    window.addEventListener('resize', resize, { passive: true });
    resize();

    document.body.addEventListener('modeChange', () => {
      const isJour = document.body.classList.contains('mode-jour');
      if (this.canvas) this.canvas.style.opacity = isJour ? '0' : '1';
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.active = false;
      } else {
        this.active = true;
        this.draw();
      }
    });

    this.draw();
  },

  isScrolling() {
    try {
      return document.documentElement.classList.contains('is-scrolling');
    } catch (e) {
      return false;
    }
  },

  draw() {
    if (!this.canvas || !this.active) return;
    // Pendant un scroll rapide, on évite de redessiner le canvas (cohérence avec la vitesse de scroll)
    // et on supprime l'effet “rattrapage” visuel.
    if (this.isScrolling()) {
      this.paused = true;
      this.raf = requestAnimationFrame(() => this.draw());
      return;
    }
    this.paused = false;
    const W = this.canvas.width;
    const H = this.canvas.height;
    const ctx = this.ctx;
    const s = this._scale;

    ctx.clearRect(0, 0, W, H);

    /* ── Nappes aurora ─────────────────────────────────────── */
    this.layers.forEach((l) => {
      const x =
        W * (l.cx + Math.sin(this.t * l.vx * 1000) * 0.12 + Math.cos(this.t * l.vx * 700) * 0.05);
      const y =
        H * (l.cy + Math.cos(this.t * l.vy * 1000) * 0.1 + Math.sin(this.t * l.vy * 600) * 0.04);
      const pulse = Math.sin(this.t * 0.018) * l.pa;
      const alpha = Math.max(0, l.a + pulse);
      const maxR = Math.max(W * l.rx, H * l.ry);
      const g = ctx.createRadialGradient(x, y, 0, x, y, maxR);
      g.addColorStop(0, `rgba(${l.r},${l.g},${l.b},${alpha})`);
      g.addColorStop(0.35, `rgba(${l.r},${l.g},${l.b},${alpha * 0.55})`);
      g.addColorStop(0.65, `rgba(${l.r},${l.g},${l.b},${alpha * 0.22})`);
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    });

    /* ── Micro-particules Lissajous ────────────────────────── */
    this.particles.forEach((p) => {
      p.life++;

      /* Réinitialisation douce quand fin de vie */
      if (p.life > p.lifeMax) {
        p.life = 0;
        p.bx = 0.05 + Math.random() * 0.9;
        p.by = 0.95; // réapparaît en bas
        p.lifeMax = (400 + Math.random() * 600) | 0;
      }

      /* Position Lissajous composée */
      const cx = p.bx + Math.sin(this.t * p.fx + p.px) * p.Ax;
      const cy = p.by + Math.sin(this.t * p.fy + p.py) * p.Ay + p.drift * p.life;
      const px = cx * W;
      const py = cy * H;

      /* Enveloppe d'opacité : fade-in / sustain / fade-out */
      const lifeRatio = p.life / p.lifeMax;
      const env =
        lifeRatio < 0.08 ? lifeRatio / 0.08 : lifeRatio > 0.88 ? (1 - lifeRatio) / 0.12 : 1.0;
      /* Pulsation bioluminescente */
      const pulse = 0.75 + 0.25 * Math.sin(this.t * p.pw * 1000);
      const alpha = p.a * env * pulse;

      if (alpha < 0.02) return;

      /* Traîne lumineuse */
      if (p.trail && p.trail.length > 0) {
        p.trail.unshift({ x: px, y: py });
        p.trail.length = Math.min(p.trail.length, p.trail.length);
        for (let i = 1; i < p.trail.length; i++) {
          const t0 = p.trail[i - 1];
          const t1 = p.trail[i];
          if (!t0 || !t1) continue;
          const ta = alpha * (1 - i / p.trail.length) * 0.5;
          ctx.beginPath();
          ctx.moveTo((t0.x * s) / 1, (t0.y * s) / 1);
          // trail coords are already in canvas space
          ctx.lineTo((t1.x * s) / 1, (t1.y * s) / 1);
          ctx.strokeStyle = `rgba(${p.r},${p.g},${p.b},${ta})`;
          ctx.lineWidth = p.size * 0.5 * s;
          ctx.stroke();
        }
      }

      /* Halo externe doux */
      const halo = ctx.createRadialGradient(px, py, 0, px, py, p.size * 5 * s);
      halo.addColorStop(0, `rgba(${p.r},${p.g},${p.b},${alpha * 0.5})`);
      halo.addColorStop(0.5, `rgba(${p.r},${p.g},${p.b},${alpha * 0.15})`);
      halo.addColorStop(1, 'transparent');
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(px, py, p.size * 5 * s, 0, Math.PI * 2);
      ctx.fill();

      /* Point central lumineux */
      ctx.beginPath();
      ctx.arc(px, py, p.size * s, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.r},${p.g},${p.b},${Math.min(1, alpha * 1.4)})`;
      ctx.fill();
    });

    this.t++;
    this.raf = requestAnimationFrame(() => this.draw());
  },

  destroy() {
    if (this.raf) cancelAnimationFrame(this.raf);
    if (this.canvas) this.canvas.remove();
    this.canvas = null;
    this.active = false;
  },
};

document.addEventListener('DOMContentLoaded', () => {
  const isJour = document.body.classList.contains('mode-jour');
  if (!isJour) PandoraNight.init();
  document.body.addEventListener('modeChange', () => {
    const isJour = document.body.classList.contains('mode-jour');
    if (!isJour && !PandoraNight.canvas) PandoraNight.init();
  });
});
