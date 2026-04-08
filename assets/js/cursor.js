/* PINAPP — cursor.js — v6
   Curseur personnalisé — teal en nuit · violet en jour
   Magnétisme sur .btn-primary
   Desktop uniquement (>= 1024px, pas de touch)
   ================================================================= */

const Cursor = {
  el: null,
  trail: null,
  tx: 0,
  ty: 0,
  x: 0,
  y: 0,
  raf: 0,
  lastMove: 0,
  idleMs: 1800,
  active: false,

  getStyle() {
    const jour = document.body.classList.contains('mode-jour');
    /* Couleurs: on lit les tokens pour rester cohérent (fallbacks sûrs) */
    const rs = getComputedStyle(document.documentElement);
    const teal = (rs.getPropertyValue('--accent-teal') || '#00E5CC').trim();
    const violet = (rs.getPropertyValue('--accent-violet') || '#5B3FD8').trim();
    return jour
      ? { color: violet, glow: 'rgba(91,63,216,', blend: 'multiply' }
      : { color: teal, glow: 'rgba(0,229,204,', blend: 'screen' };
  },

  init() {
    if ('ontouchstart' in window) return;
    if (window.innerWidth < 1024) return;

    this.el = document.createElement('div');
    this.el.id = 'pcursor';
    this.trail = document.createElement('div');
    this.trail.id = 'pcursor-trail';
    document.body.appendChild(this.el);
    document.body.appendChild(this.trail);
    document.body.style.cursor = 'none';

    this.applyStyle();
    document.body.addEventListener('modeChange', () => this.applyStyle());

    document.addEventListener('mousemove', (e) => {
      this.tx = e.clientX;
      this.ty = e.clientY;
      this.lastMove = Date.now();
      if (!this.active) {
        this.active = true;
        this.animate();
      }
    });

    // Hover sur liens, boutons, cards
    document.querySelectorAll('a,button,[role=button],.block,.card').forEach((el) => {
      el.style.cursor = 'none';
      el.addEventListener('mouseenter', () => this.el.classList.add('hover'));
      el.addEventListener('mouseleave', () => this.el.classList.remove('hover'));
    });

    document.addEventListener('mousedown', () => this.el.classList.add('clicking'));
    document.addEventListener('mouseup', () => this.el.classList.remove('clicking'));

    // Magnétisme CTA — le bouton se rapproche du curseur
    document.querySelectorAll('.btn-primary').forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.14;
        const y = (e.clientY - r.top - r.height / 2) * 0.14;
        btn.style.transform = `translate(${x}px,${y}px) translateZ(0)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
        btn.style.transition = 'transform 300ms cubic-bezier(0.45,0.05,0.55,0.95)';
        setTimeout(() => {
          btn.style.transition = '';
        }, 350);
      });
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) this.stop();
    });
  },

  applyStyle() {
    const s = this.getStyle();
    if (this.el) {
      this.el.style.background = s.color;
      this.el.style.boxShadow = `0 0 8px ${s.glow}0.9), 0 0 20px ${s.glow}0.6), 0 0 40px ${s.glow}0.3)`;
      this.el.style.mixBlendMode = s.blend;
    }
    if (this.trail) {
      this.trail.style.borderColor = s.glow + '0.35)';
      this.trail.style.mixBlendMode = s.blend;
    }
  },

  stop() {
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
    this.active = false;
  },

  animate() {
    if (!this.active) return;
    if (document.hidden) {
      this.stop();
      return;
    }
    if (Date.now() - this.lastMove > this.idleMs) {
      this.stop();
      return;
    }
    const dx = this.tx - this.x;
    const dy = this.ty - this.y;
    this.x += dx * 0.15;
    this.y += dy * 0.15;
    if (this.el) {
      this.el.style.left = this.tx + 'px';
      this.el.style.top = this.ty + 'px';
    }
    /* N'écrire dans le DOM que si le trail bouge vraiment (évite RAF infini à 120 Hz) */
    if (this.trail && (Math.abs(dx) > 0.05 || Math.abs(dy) > 0.05)) {
      this.trail.style.left = this.x + 'px';
      this.trail.style.top = this.y + 'px';
    }
    this.raf = requestAnimationFrame(() => this.animate());
  },
};

document.addEventListener('DOMContentLoaded', () => Cursor.init());
