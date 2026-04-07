/* PINAPP — pandora-night.js — v5
   Canvas aurora bioluminescente — 6 couches
   Colorimétrie : Parc Avatar Disney (nuit)
   Tempo : The Light Always Returns — 3.5s
   Desktop uniquement (>= 768px) */

const PandoraNight = {
  canvas: null, ctx: null, t: 0, raf: null,
  active: false,

  layers: [
    // Cyan bioluminescent — gauche bas
    { cx:0.15, cy:0.65, rx:0.42, ry:0.32,
      r:0,   g:160, b:210, a:0.32,
      vx:0.00018, vy:0.00014,
      pw:0.00008, pa:0.06 },
    // Turquoise — centre haut
    { cx:0.50, cy:0.40, rx:0.38, ry:0.28,
      r:0,   g:210, b:170, a:0.28,
      vx:-0.00015, vy:0.00012,
      pw:0.00010, pa:0.05 },
    // Violet Pandora — droite haut
    { cx:0.80, cy:0.28, rx:0.40, ry:0.30,
      r:90,  g:10,  b:150, a:0.22,
      vx:0.00012, vy:-0.00016,
      pw:0.00006, pa:0.04 },
    // Violet étoilé — gauche haut
    { cx:0.22, cy:0.20, rx:0.32, ry:0.24,
      r:140, g:40,  b:220, a:0.18,
      vx:-0.00010, vy:0.00012,
      pw:0.00007, pa:0.03 },
    // Ambre champignons — droite bas
    { cx:0.88, cy:0.72, rx:0.20, ry:0.15,
      r:255, g:180, b:40,  a:0.14,
      vx:0.00008, vy:-0.00010,
      pw:0.00012, pa:0.04 },
    // Vert organique — bas centre
    { cx:0.45, cy:0.88, rx:0.28, ry:0.20,
      r:0,   g:200, b:120, a:0.16,
      vx:0.00014, vy:0.00008,
      pw:0.00009, pa:0.05 },
  ],

  init() {
    if (this.canvas) return;
    const isMobile = window.innerWidth < 768;

    this.canvas = document.createElement('canvas');
    this.canvas.id = 'pandora-canvas';
    this.canvas.style.cssText =
      'position:fixed;inset:0;z-index:0;' +
      'pointer-events:none;' +
      'mix-blend-mode:screen;' +
      'will-change:opacity;' +
      'transition:opacity 500ms ease;';
    document.body.prepend(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    this.active = true;

    // Mobile : canvas à demi-résolution pour les performances
    this._scale = isMobile ? 0.5 : 1;
    // Mobile : utiliser 4 couches sur 6
    if (isMobile) this.layers = this.layers.slice(0, 4);

    const resize = () => {
      const s = this._scale;
      this.canvas.width  = Math.round(window.innerWidth  * s);
      this.canvas.height = Math.round(window.innerHeight * s);
      this.canvas.style.width  = window.innerWidth  + 'px';
      this.canvas.style.height = window.innerHeight + 'px';
    };
    window.addEventListener('resize', resize, { passive: true });
    resize();

    // Mode change listener
    document.body.addEventListener('modeChange', () => {
      const isJour = document.body.classList.contains('mode-jour');
      if (this.canvas) {
        this.canvas.style.opacity = isJour ? '0' : '1';
      }
    });

    // Pause si onglet invisible (économie batterie)
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

  draw() {
    if (!this.canvas || !this.active) return;
    const W = this.canvas.width;
    const H = this.canvas.height;
    const ctx = this.ctx;

    ctx.clearRect(0, 0, W, H);

    this.layers.forEach(l => {
      const x = W * (l.cx +
        Math.sin(this.t * l.vx * 1000) * 0.12 +
        Math.cos(this.t * l.vx * 700) * 0.05);
      const y = H * (l.cy +
        Math.cos(this.t * l.vy * 1000) * 0.10 +
        Math.sin(this.t * l.vy * 600) * 0.04);

      // Pulsation — tempo musical 3.5s (≈ 0.018 rad/frame à 60fps)
      const pulse = Math.sin(this.t * 0.018) * l.pa;
      const alpha = Math.max(0, l.a + pulse);

      const maxR = Math.max(W * l.rx, H * l.ry);
      const g = ctx.createRadialGradient(x, y, 0, x, y, maxR);
      g.addColorStop(0,    `rgba(${l.r},${l.g},${l.b},${alpha})`);
      g.addColorStop(0.35, `rgba(${l.r},${l.g},${l.b},${alpha * 0.55})`);
      g.addColorStop(0.65, `rgba(${l.r},${l.g},${l.b},${alpha * 0.22})`);
      g.addColorStop(1,    'transparent');

      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    });

    this.t++;
    this.raf = requestAnimationFrame(() => this.draw());
  },

  destroy() {
    if (this.raf) cancelAnimationFrame(this.raf);
    if (this.canvas) this.canvas.remove();
    this.canvas = null;
    this.active = false;
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const isJour = document.body.classList.contains('mode-jour');
  if (!isJour) PandoraNight.init();
});
