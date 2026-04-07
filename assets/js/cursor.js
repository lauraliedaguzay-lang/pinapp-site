/* PINAPP — cursor.js — v5
   Curseur personnalisé — teal en nuit · violet en jour
   Magnétisme sur .btn-primary
   Desktop uniquement (>= 1024px, pas de touch)
   ================================================================= */

const Cursor = {
  el: null, trail: null,
  tx: 0, ty: 0, x: 0, y: 0,

  getStyle() {
    const jour = document.body.classList.contains('mode-jour');
    return jour
      ? { color: '#5B3FD8', glow: 'rgba(91,63,216,',  blend: 'multiply' }
      : { color: '#00E5CC', glow: 'rgba(0,229,204,',  blend: 'screen'   };
  },

  init() {
    if ('ontouchstart' in window) return;
    if (window.innerWidth < 1024) return;

    this.el    = document.createElement('div');
    this.el.id = 'pcursor';
    this.trail    = document.createElement('div');
    this.trail.id = 'pcursor-trail';
    document.body.appendChild(this.el);
    document.body.appendChild(this.trail);
    document.body.style.cursor = 'none';

    this.applyStyle();
    document.body.addEventListener('modeChange', () => this.applyStyle());

    document.addEventListener('mousemove', e => {
      this.tx = e.clientX;
      this.ty = e.clientY;
    });

    // Hover sur liens, boutons, cards
    document.querySelectorAll('a,button,[role=button],.block,.card')
      .forEach(el => {
        el.style.cursor = 'none';
        el.addEventListener('mouseenter', () => this.el.classList.add('hover'));
        el.addEventListener('mouseleave', () => this.el.classList.remove('hover'));
      });

    document.addEventListener('mousedown', () => this.el.classList.add('clicking'));
    document.addEventListener('mouseup',   () => this.el.classList.remove('clicking'));

    // Magnétisme CTA — le bouton se rapproche du curseur
    document.querySelectorAll('.btn-primary').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width  / 2) * 0.14;
        const y = (e.clientY - r.top  - r.height / 2) * 0.14;
        btn.style.transform = `translate(${x}px,${y}px) translateZ(0)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
        btn.style.transition = 'transform 300ms cubic-bezier(0.45,0.05,0.55,0.95)';
        setTimeout(() => { btn.style.transition = ''; }, 350);
      });
    });

    this.animate();
  },

  applyStyle() {
    const s = this.getStyle();
    if (this.el) {
      this.el.style.background  = s.color;
      this.el.style.boxShadow   =
        `0 0 8px ${s.glow}0.9),
         0 0 20px ${s.glow}0.6),
         0 0 40px ${s.glow}0.3)`;
      this.el.style.mixBlendMode = s.blend;
    }
    if (this.trail) {
      this.trail.style.borderColor  = s.glow + '0.35)';
      this.trail.style.mixBlendMode = s.blend;
    }
  },

  animate() {
    this.x += (this.tx - this.x) * 0.15;
    this.y += (this.ty - this.y) * 0.15;
    if (this.el) {
      this.el.style.left = this.tx + 'px';
      this.el.style.top  = this.ty + 'px';
    }
    if (this.trail) {
      this.trail.style.left = this.x + 'px';
      this.trail.style.top  = this.y + 'px';
    }
    requestAnimationFrame(() => this.animate());
  }
};

document.addEventListener('DOMContentLoaded', () => Cursor.init());
