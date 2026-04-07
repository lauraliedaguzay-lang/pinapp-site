/* PINAPP — aurora.js — Canvas aurora desktop (≥768px) */
const Aurora = {
  canvas: null,
  ctx: null,
  t: 0,
  raf: null,

  isJour() {
    /* Priorité data-theme (main.js), fallback mode-jour (classe body) */
    const t = document.documentElement.getAttribute('data-theme');
    if (t === 'light') return true;
    if (t === 'dark') return false;
    return document.body.classList.contains('mode-jour');
  },

  getColors() {
    return this.isJour()
      ? /* Pandora jour lumineux : jade · ambre · pêche corail */
        ['#0FBF8E', '#C47820', '#E0825A']
      : /* Pandora nuit : teal électrique, violet profond, vert bioluminescent */
        ['#00E5CC', '#7B4FE8', '#39E075'];
  },

  getOpacity() {
    /* Jour : plus visible sur fond clair + mix-blend-mode multiply */
    return this.isJour() ? 0.55 : 0.22;
  },

  getBlendMode() {
    return this.isJour() ? 'multiply' : 'screen';
  },

  init() {
    /* Canvas léger sur tout écran ≥390px (mobile inclus) — désactivé si réduit mouvement */
    if (window.innerWidth < 390) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    this.canvas = document.createElement('canvas');
    this.canvas.setAttribute('aria-hidden', 'true');
    this.canvas.style.cssText =
      'position:fixed;inset:0;pointer-events:none;' +
      `z-index:0;mix-blend-mode:${this.getBlendMode()};` +
      'will-change:opacity;';
    document.body.prepend(this.canvas);
    this.ctx = this.canvas.getContext('2d');

    this.orbs = [
      { cx: 0.25, cy: 0.35, rx: 0.48, ry: 0.38, vx: 0.00022, vy: 0.00016 },
      { cx: 0.75, cy: 0.65, rx: 0.42, ry: 0.32, vx: -0.00018, vy: 0.00022 },
      { cx: 0.5, cy: 0.82, rx: 0.36, ry: 0.26, vx: 0.00016, vy: -0.0002 },
    ];

    const resize = () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize, { passive: true });
    resize();

    document.body.addEventListener('modeChange', () => {
      if (this.canvas) {
        this.canvas.style.opacity = this.getOpacity();
        this.canvas.style.mixBlendMode = this.getBlendMode();
      }
    });

    /* Pause quand onglet invisible (économie CPU) */
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(this.raf);
      } else {
        this.draw();
      }
    });

    this.draw();
  },

  draw() {
    const ctx = this.ctx;
    const W = this.canvas.width;
    const H = this.canvas.height;
    const colors = this.getColors();

    ctx.clearRect(0, 0, W, H);
    this.canvas.style.opacity = this.getOpacity();

    this.orbs.forEach((o, i) => {
      const x = W * (o.cx + Math.sin(this.t * o.vx * 1000) * 0.16);
      const y = H * (o.cy + Math.cos(this.t * o.vy * 1000) * 0.13);
      const g = ctx.createRadialGradient(x, y, 0, x, y, W * o.rx);
      g.addColorStop(0, colors[i] + '55');
      g.addColorStop(0.5, colors[i] + '22');
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    });

    this.t++;
    this.raf = requestAnimationFrame(() => this.draw());
  },
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => Aurora.init());
} else {
  Aurora.init();
}
