/* PINAPP — apercus.js — 4 mini-canvas animés
   Hover desktop → teinte le fond du site
   Tap mobile → teinte 2s puis revient
   ============================================================ */

const Apercus = {
  init() {
    document.querySelectorAll('.apercu-card').forEach((card) => {
      const canvas = card.querySelector('.apercu-canvas');
      const fond = card.dataset.fond;
      const c1 = card.dataset.c1;
      const c2 = card.dataset.c2;
      const monde = card.dataset.monde;

      if (canvas) this.drawCanvas(canvas, fond, c1, c2);

      if (!('ontouchstart' in window)) {
        card.addEventListener('mouseenter', () => this.tintSite(fond, c1, c2));
        card.addEventListener('mouseleave', () => this.resetSite());
      }

      card.addEventListener('click', () => {
        this.tintSite(fond, c1, c2);
        setTimeout(() => this.resetSite(), 2000);
        const target = document.querySelector(`[data-id="${monde}"]`);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    });
  },

  drawCanvas(canvas, fond, c1, c2) {
    const parent = canvas.parentElement;
    const W = parent.offsetWidth || 280;
    const H = parent.offsetHeight || 200;
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    const rgb1 = this.hexRgb(c1);
    const rgb2 = this.hexRgb(c2);

    let t = 0;
    const animate = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = fond;
      ctx.fillRect(0, 0, W, H);

      const pulse = 0.45 + Math.sin(t * 0.018) * 0.1;
      const pulse2 = 0.35 + Math.cos(t * 0.022) * 0.08;

      const px1 = W * (0.3 + Math.sin(t * 0.008) * 0.06);
      const py1 = H * (0.4 + Math.cos(t * 0.01) * 0.05);
      const ga = ctx.createRadialGradient(px1, py1, 0, px1, py1, W * 0.55);
      ga.addColorStop(0, `rgba(${rgb1},${pulse})`);
      ga.addColorStop(1, 'transparent');
      ctx.fillStyle = ga;
      ctx.fillRect(0, 0, W, H);

      const px2 = W * (0.75 + Math.cos(t * 0.009) * 0.05);
      const py2 = H * (0.65 + Math.sin(t * 0.007) * 0.05);
      const gb = ctx.createRadialGradient(px2, py2, 0, px2, py2, W * 0.45);
      gb.addColorStop(0, `rgba(${rgb2},${pulse2})`);
      gb.addColorStop(1, 'transparent');
      ctx.fillStyle = gb;
      ctx.fillRect(0, 0, W, H);

      t++;
      requestAnimationFrame(animate);
    };
    animate();
  },

  tintSite(fond, c1, c2) {
    const rgb1 = this.hexRgb(c1);
    const rgb2 = this.hexRgb(c2);
    let overlay = document.getElementById('site-tint');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'site-tint';
      overlay.style.cssText =
        'position:fixed;inset:0;z-index:0;pointer-events:none;' +
        'transition:all 800ms ease;opacity:0;';
      document.body.appendChild(overlay);
    }
    overlay.style.background = `
      radial-gradient(ellipse at 20% 50%, rgba(${rgb1},0.08) 0%, transparent 60%),
      radial-gradient(ellipse at 80% 50%, rgba(${rgb2},0.06) 0%, transparent 60%)`;
    overlay.style.opacity = '1';
  },

  resetSite() {
    const overlay = document.getElementById('site-tint');
    if (overlay) {
      overlay.style.opacity = '0';
      setTimeout(() => overlay.remove(), 800);
    }
  },

  hexRgb(hex) {
    if (!hex || !hex.startsWith('#')) return '255,255,255';
    return `${parseInt(hex.slice(1, 3), 16)},${parseInt(hex.slice(3, 5), 16)},${parseInt(hex.slice(5, 7), 16)}`;
  },
};

document.addEventListener('DOMContentLoaded', () => Apercus.init());
