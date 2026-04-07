/* PINAPP — cursor.js — Curseur magnétique + traîne bioluminescente 6 points (desktop ≥1024px) */
const Cursor = {
  el:    null,
  trail: null,
  trailDots: [],    /* 6 points décroissants */
  TRAIL_COUNT: 6,

  /* Positions : main dot suit immédiatement la souris */
  mx: 0, my: 0,
  /* Trail principal (anneau) : lerp 15% */
  rx: 0, ry: 0,

  isJour() {
    const t = document.documentElement.getAttribute('data-theme');
    if (t === 'light') return true;
    if (t === 'dark')  return false;
    return document.body.classList.contains('mode-jour');
  },

  getColor() {
    return this.isJour()
      ? { main: '#1DE8B0', r: 29,  g: 232, b: 176, blend: 'screen' }
      : { main: '#00E5CC', r: 0,   g: 229, b: 204, blend: 'screen' };
  },

  init() {
    if ('ontouchstart' in window) return;
    if (window.innerWidth < 1024) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    /* Point central */
    this.el    = document.createElement('div');
    this.el.id = 'pcursor';

    /* Anneau / trail principal */
    this.trail    = document.createElement('div');
    this.trail.id = 'pcursor-trail';

    document.body.appendChild(this.el);
    document.body.appendChild(this.trail);

    /* 6 points de traîne — tailles décroissantes */
    this.trailDots = [];
    for (let i = 0; i < this.TRAIL_COUNT; i++) {
      const dot = document.createElement('div');
      dot.className = 'pcursor-dot';
      dot.dataset.idx = i;
      document.body.appendChild(dot);
      /* Chaque point garde sa propre position interpolée */
      this.trailDots.push({ el: dot, x: 0, y: 0 });
    }

    this.updateStyle();
    document.body.addEventListener('modeChange', () => this.updateStyle());

    document.addEventListener('mousemove', e => {
      this.mx = e.clientX;
      this.my = e.clientY;
    });

    /* États hover / click */
    document.querySelectorAll('a, button, [role=button], .card').forEach(el => {
      el.addEventListener('mouseenter', () => this.el.classList.add('hover'));
      el.addEventListener('mouseleave', () => this.el.classList.remove('hover'));
    });
    document.addEventListener('mousedown', () => this.el.classList.add('clicking'));
    document.addEventListener('mouseup',   () => this.el.classList.remove('clicking'));

    /* Effet magnétique sur les boutons primaires */
    document.querySelectorAll('.btn-primary').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width  / 2) * 0.14;
        const y = (e.clientY - r.top  - r.height / 2) * 0.14;
        btn.style.transform = `translate(${x}px,${y}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform  = '';
        btn.style.transition = 'transform 300ms cubic-bezier(0.25,0.1,0.25,1)';
      });
    });

    this.animate();
  },

  updateStyle() {
    const c = this.getColor();
    if (this.el) {
      this.el.style.background   = c.main;
      this.el.style.boxShadow    =
        `0 0 8px rgba(${c.r},${c.g},${c.b},0.9), ` +
        `0 0 20px rgba(${c.r},${c.g},${c.b},0.6), ` +
        `0 0 40px rgba(${c.r},${c.g},${c.b},0.3)`;
      this.el.style.mixBlendMode = c.blend;
    }
    if (this.trail) {
      this.trail.style.borderColor  = `rgba(${c.r},${c.g},${c.b},0.35)`;
      this.trail.style.mixBlendMode = c.blend;
    }

    /* Mettre à jour les points de traîne */
    this.trailDots.forEach((d, i) => {
      /* Taille : de 5px (i=0, près du curseur) à 1.5px (i=5, loin) */
      const size    = Math.max(1.5, 5 - i * 0.7);
      /* Opacité décroissante */
      const opacity = (0.55 - i * 0.08).toFixed(2);
      Object.assign(d.el.style, {
        width:        `${size}px`,
        height:       `${size}px`,
        background:   `rgba(${c.r},${c.g},${c.b},${opacity})`,
        boxShadow:    `0 0 ${size * 2}px rgba(${c.r},${c.g},${c.b},${opacity})`,
        mixBlendMode: c.blend,
      });
    });
  },

  animate() {
    /* Point principal : colle à la souris */
    if (this.el) {
      this.el.style.left = this.mx + 'px';
      this.el.style.top  = this.my + 'px';
    }

    /* Anneau : suit avec inertie 15% */
    this.rx += (this.mx - this.rx) * 0.15;
    this.ry += (this.my - this.ry) * 0.15;
    if (this.trail) {
      this.trail.style.left = this.rx + 'px';
      this.trail.style.top  = this.ry + 'px';
    }

    /* Traîne : chaque point suit le précédent avec inertie décroissante
       i=0 → lerp 45% (colle), i=5 → lerp 8% (traîne long) */
    this.trailDots.forEach((d, i) => {
      const lerp   = 0.45 - i * 0.06;          /* 45% → 15% */
      const target = i === 0
        ? { x: this.mx, y: this.my }
        : { x: this.trailDots[i - 1].x, y: this.trailDots[i - 1].y };

      d.x += (target.x - d.x) * lerp;
      d.y += (target.y - d.y) * lerp;
      d.el.style.left = d.x + 'px';
      d.el.style.top  = d.y + 'px';
    });

    requestAnimationFrame(() => this.animate());
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => Cursor.init());
} else {
  Cursor.init();
}
