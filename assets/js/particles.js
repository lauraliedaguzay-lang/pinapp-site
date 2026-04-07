/* PINAPP — particles.js — Woodsprites Na'vi : spores bioluminescentes montant vers le ciel */

const Particles = {
  get count() {
    /* Réduire les particules sur mobile pour économiser le GPU iOS */
    return window.matchMedia('(max-width: 767px)').matches ? 3 : 7;
  },

  isJour() {
    const t = document.documentElement.getAttribute('data-theme');
    if (t === 'light') return true;
    if (t === 'dark')  return false;
    return document.body.classList.contains('mode-jour');
  },

  getColors() {
    /* Jour : ambre+jade Pandora / Nuit : teal+violet bioluminescent */
    return this.isJour()
      /* Jour : ambre · jade · pêche corail */
      ? ['rgba(232,160,48,0.55)', 'rgba(29,232,176,0.40)', 'rgba(224,130,90,0.50)']
      : ['rgba(0,229,204,0.55)',  'rgba(107,158,255,0.40)', 'rgba(29,232,176,0.50)'];
  },

  createCSS() {
    if (document.getElementById('pinapp-particle-css')) {
      document.getElementById('pinapp-particle-css').remove();
    }
    const jour = this.isJour();
    /* Jour : ambre · jade · pêche corail — Nuit : teal · violet · jade */
    const glowA = jour ? 'rgba(232,160,48,0.60)'  : 'rgba(0,229,204,0.60)';
    const glowB = jour ? 'rgba(224,130,90,0.55)'  : 'rgba(107,158,255,0.50)';  /* pêche jour */

    const style = document.createElement('style');
    style.id = 'pinapp-particle-css';
    style.textContent = `
      /* --- Woodsprite : monte de bas en haut avec dérive organique --- */
      @keyframes spore-rise {
        0%   { transform: translate(0, 0)       scale(0.4); opacity: 0; }
        8%   { opacity: 1; }
        45%  { transform: translate(var(--dx1), -42vh)      scale(1); }
        85%  { transform: translate(var(--dx2), -88vh)      scale(0.75); opacity: 0.5; }
        100% { transform: translate(var(--dx3), -110vh)     scale(0.3); opacity: 0; }
      }

      .pinapp-particle {
        position: fixed;
        bottom: -10px;
        border-radius: 50%;
        pointer-events: none;
        z-index: 1;
        will-change: transform, opacity;
        opacity: 0;
        animation: spore-rise var(--dur) ease-in-out infinite;
        animation-delay: var(--delay);
      }

      /* Halo pulsant autour du corps central */
      .pinapp-particle::before {
        content: '';
        position: absolute;
        inset: -150%;
        border-radius: 50%;
        animation: halo-pulse var(--dur-halo) ease-in-out infinite;
      }
      @keyframes halo-pulse {
        0%, 100% { opacity: 0.20; transform: scale(1); }
        50%       { opacity: 0.55; transform: scale(1.35); }
      }

      /* Jour */
      html[data-theme="light"]  .pinapp-particle:nth-child(3n+1)::before,
      body.mode-jour .pinapp-particle:nth-child(3n+1)::before {
        background: radial-gradient(circle, ${glowA} 0%, transparent 70%);
      }
      html[data-theme="light"]  .pinapp-particle:nth-child(3n+2)::before,
      body.mode-jour .pinapp-particle:nth-child(3n+2)::before {
        background: radial-gradient(circle, ${glowB} 0%, transparent 70%);
      }
      html[data-theme="light"]  .pinapp-particle:nth-child(3n)::before,
      body.mode-jour .pinapp-particle:nth-child(3n)::before {
        background: radial-gradient(circle, rgba(29,232,176,0.50) 0%, transparent 70%);
      }

      /* Nuit */
      html[data-theme="dark"]  .pinapp-particle:nth-child(3n+1)::before,
      body.mode-nuit .pinapp-particle:nth-child(3n+1)::before {
        background: radial-gradient(circle, ${glowA} 0%, transparent 70%);
      }
      html[data-theme="dark"]  .pinapp-particle:nth-child(3n+2)::before,
      body.mode-nuit .pinapp-particle:nth-child(3n+2)::before {
        background: radial-gradient(circle, ${glowB} 0%, transparent 70%);
      }
      html[data-theme="dark"]  .pinapp-particle:nth-child(3n)::before,
      body.mode-nuit .pinapp-particle:nth-child(3n)::before {
        background: radial-gradient(circle, rgba(29,232,176,0.55) 0%, transparent 70%);
      }

      @media (prefers-reduced-motion: reduce) {
        .pinapp-particle { display: none; }
      }
    `;
    document.head.appendChild(style);
  },

  clearParticles() {
    document.querySelectorAll('.pinapp-particle').forEach(p => p.remove());
  },

  buildParticles() {
    const colors = this.getColors();
    for (let i = 0; i < this.count; i++) {
      const p   = document.createElement('div');
      p.className = 'pinapp-particle';

      const size    = 2 + Math.random() * 3;         /* 2–5px */
      const dur     = 14 + Math.random() * 12;        /* 14–26s */
      const durHalo = 2 + Math.random() * 3;          /* 2–5s */
      const delay   = -(Math.random() * dur).toFixed(1);
      const left    = 5 + Math.random() * 90;         /* 5–95% horizontal */
      const color   = colors[i % colors.length];

      /* Dérive horizontale organique : 3 waypoints CSS custom props */
      const dx = () => `${(Math.random() * 80 - 40).toFixed(0)}px`;

      Object.assign(p.style, {
        width:  `${size}px`,
        height: `${size}px`,
        left:   `${left}%`,
        background: color,
        boxShadow: `0 0 ${size * 2}px ${size / 2}px ${color}`,
        '--dur':      `${dur}s`,
        '--dur-halo': `${durHalo}s`,
        '--delay':    `${delay}s`,
        '--dx1':      dx(),
        '--dx2':      dx(),
        '--dx3':      dx(),
      });

      document.body.appendChild(p);
    }
  },

  init() {
    this.createCSS();
    this.buildParticles();

    /* Reconstituer les spores lors d'un changement de mode */
    document.body.addEventListener('modeChange', () => {
      this.clearParticles();
      this.createCSS();
      this.buildParticles();
    });
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => Particles.init());
} else {
  Particles.init();
}
