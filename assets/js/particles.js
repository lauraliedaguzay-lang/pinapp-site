/* PINAPP — particles.js — 4 particules bioluminescentes (mobile + desktop) */

const Particles = {
  count: 4,

  isJour() {
    const t = document.documentElement.getAttribute('data-theme');
    if (t === 'light') return true;
    if (t === 'dark') return false;
    return document.body.classList.contains('mode-jour');
  },

  getColor() {
    /* Jour : ambre chaud Pandora / Nuit : teal bioluminescent */
    return this.isJour()
      ? () => `rgba(232,160,48,${(0.18 + Math.random() * 0.22).toFixed(2)})`
      : () => `rgba(0,229,204,${(0.15 + Math.random() * 0.20).toFixed(2)})`;
  },

  createCSS() {
    if (document.getElementById('pinapp-particle-css')) return;
    const style = document.createElement('style');
    style.id = 'pinapp-particle-css';
    style.textContent = `
      @keyframes particle-float {
        0%, 100% { transform: translate(0,0) scale(1); opacity: 0.15; }
        33%       { transform: translate(15px,-25px) scale(1.4); opacity: 0.35; }
        66%       { transform: translate(-10px,15px) scale(0.8); opacity: 0.20; }
      }
      @keyframes particle-float-b {
        0%, 100% { transform: translate(0,0) scale(1); opacity: 0.12; }
        40%       { transform: translate(-18px,-20px) scale(1.3); opacity: 0.30; }
        70%       { transform: translate(12px,18px) scale(0.85); opacity: 0.18; }
      }
      .pinapp-particle {
        position: fixed;
        border-radius: 50%;
        pointer-events: none;
        z-index: 1;
        filter: blur(1px);
        will-change: transform, opacity;
      }
      @media (prefers-reduced-motion: reduce) {
        .pinapp-particle { display: none; }
      }
    `;
    document.head.appendChild(style);
  },

  init() {
    this.createCSS();
    const colorFn = this.getColor();
    const anims = ['particle-float', 'particle-float-b'];

    for (let i = 0; i < this.count; i++) {
      const p = document.createElement('div');
      p.className = 'pinapp-particle';
      const size = 2 + Math.random() * 2;
      const dur  = 10 + Math.random() * 6;
      const anim = anims[i % 2];

      p.style.cssText = [
        `width:${size}px`,
        `height:${size}px`,
        `background:${colorFn()}`,
        `left:${10 + Math.random() * 80}%`,
        `top:${10 + Math.random() * 80}%`,
        `animation:${anim} ${dur}s ease-in-out infinite`,
        `animation-delay:-${(Math.random() * dur).toFixed(1)}s`,
      ].join(';');

      document.body.appendChild(p);
    }

    /* Mettre à jour les couleurs au changement de mode */
    document.body.addEventListener('modeChange', () => {
      const jour = this.isJour();
      document.querySelectorAll('.pinapp-particle').forEach(p => {
        const alpha = jour
          ? (0.18 + Math.random() * 0.22).toFixed(2)
          : (0.15 + Math.random() * 0.20).toFixed(2);
        p.style.background = jour
          ? `rgba(232,160,48,${alpha})`
          : `rgba(0,229,204,${alpha})`;
      });
    });
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => Particles.init());
} else {
  Particles.init();
}
