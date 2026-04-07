/* PINAPP — cursor.js — Curseur magnétique (desktop ≥1024px, pas de touch) */
const Cursor = {
  el: null,
  trail: null,
  tx: 0, ty: 0,
  x: 0,  y: 0,

  isJour() {
    const t = document.documentElement.getAttribute('data-theme');
    if (t === 'light') return true;
    if (t === 'dark') return false;
    return document.body.classList.contains('mode-jour');
  },

  getColor() {
    return this.isJour()
      ? { main: '#7B4FE8', glow: 'rgba(123,79,232,', blend: 'multiply' }
      : { main: '#00E5CC', glow: 'rgba(0,229,204,',  blend: 'screen'   };
  },

  init() {
    if ('ontouchstart' in window) return;
    if (window.innerWidth < 1024) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    this.el    = document.createElement('div');
    this.el.id = 'pcursor';
    this.trail    = document.createElement('div');
    this.trail.id = 'pcursor-trail';
    document.body.appendChild(this.el);
    document.body.appendChild(this.trail);

    this.updateStyle();
    document.body.addEventListener('modeChange', () => this.updateStyle());

    document.addEventListener('mousemove', e => {
      this.tx = e.clientX;
      this.ty = e.clientY;
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
      this.el.style.background  = c.main;
      this.el.style.boxShadow   =
        `0 0 8px ${c.glow}0.9), 0 0 20px ${c.glow}0.6), 0 0 40px ${c.glow}0.3)`;
      this.el.style.mixBlendMode = c.blend;
    }
    if (this.trail) {
      /* Convertit hex → rgba pour la bordure */
      const hex = c.main.replace('#', '');
      const r   = parseInt(hex.slice(0, 2), 16);
      const g   = parseInt(hex.slice(2, 4), 16);
      const b   = parseInt(hex.slice(4, 6), 16);
      this.trail.style.borderColor  = `rgba(${r},${g},${b},0.35)`;
      this.trail.style.mixBlendMode = c.blend;
    }
  },

  animate() {
    /* Point principal : suit exactement la souris */
    if (this.el) {
      this.el.style.left = this.tx + 'px';
      this.el.style.top  = this.ty + 'px';
    }
    /* Trail : suit avec inertie (lerp 15%) */
    this.x += (this.tx - this.x) * 0.15;
    this.y += (this.ty - this.y) * 0.15;
    if (this.trail) {
      this.trail.style.left = this.x + 'px';
      this.trail.style.top  = this.y + 'px';
    }
    requestAnimationFrame(() => this.animate());
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => Cursor.init());
} else {
  Cursor.init();
}
