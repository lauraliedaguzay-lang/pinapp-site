/* PINAPP — particles.js — v5
   6 particules bioluminescentes ascendantes — voix Na'vi
   Tempo : The Light Always Returns — 3.5s
   Toujours vers le haut — ascension
   ================================================================= */

const Particles = {
  active: false,

  init() {
    if (this.active) return;

    const isJour = document.body.classList.contains('mode-jour');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mobile = window.innerWidth < 768;
    /* Anti-lag : 0 si reduced motion, 3 mobile, 6 desktop */
    const count = reduced ? 0 : mobile ? 3 : 6;
    if (count === 0) return;
    this.active = true;
    const colorsNuit = [
      'rgba(0,200,188,',
      'rgba(0,229,204,',
      'rgba(123,79,232,',
      'rgba(196,30,168,',
    ];
    const colorsJour = ['rgba(123,79,232,', 'rgba(200,160,240,', 'rgba(255,190,80,'];
    const colors = isJour ? colorsJour : colorsNuit;

    const fragment = document.createDocumentFragment();

    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      const size = 2 + Math.random() * 2.5;
      const dur = 20 + Math.random() * 16;
      const color = colors[i % colors.length];
      const opacity = 0.15 + Math.random() * 0.22;
      const dx = (Math.random() - 0.5) * 20;

      p.style.cssText = `
        position:fixed;
        width:${size}px;
        height:${size}px;
        border-radius:50%;
        background:${color}${opacity});
        pointer-events:none;
        z-index:1;
        left:${10 + Math.random() * 80}%;
        top:${20 + Math.random() * 70}%;
        filter:${mobile ? 'none' : 'blur(1px)'};
        box-shadow:
          0 0 6px ${color}0.8),
          0 0 12px ${color}0.4),
          0 0 24px ${color}0.2);
        animation:particle-ascend ${dur}s ease-in-out infinite;
        animation-delay:-${Math.random() * dur}s;
        --dx:${dx}px;
        will-change:auto;
      `;
      fragment.appendChild(p);
    }

    document.body.appendChild(fragment);

    // Injecter les keyframes une seule fois
    if (!document.getElementById('particle-style')) {
      const style = document.createElement('style');
      style.id = 'particle-style';
      style.textContent = `
        @keyframes particle-ascend {
          0% {
            transform: translate(0,0) scale(1);
            opacity: 0;
          }
          10% { opacity: 1; }
          80% { opacity: 0.8; }
          100% {
            transform: translate(var(--dx,0px), -60px) scale(0.6);
            opacity: 0;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="particle-ascend"] { animation: none !important; }
        }
      `;
      document.head.appendChild(style);
    }

    // Mettre à jour les couleurs au changement de mode
    document.body.addEventListener('modeChange', () => {
      // Supprimer et recréer les particules
      document.querySelectorAll('[style*="particle-ascend"]').forEach((el) => el.remove());
      this.active = false;
      this.init();
    });
  },
};

document.addEventListener('DOMContentLoaded', () => {
  Particles.init();
});
