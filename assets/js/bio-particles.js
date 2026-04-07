/* PINAPP — bio-particles.js
   Spores bioluminescentes Pandora — nuit teal/violet/vert + jour ambre/jade
   Réactif au mode jour/nuit via mutation observer
   ================================================================= */

(function () {
  'use strict';

  /* Uniquement sur desktop et sans prefers-reduced-motion */
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.innerWidth < 1024) return;

  const NUIT_TYPES  = ['spore', 'violet', 'wood', 'spore', 'violet'];
  const JOUR_TYPES  = ['ambre', 'ambre', 'wood', 'ambre', 'wood'];
  const COUNT       = 20;
  let   particles   = [];

  /* Détermine si on est en mode jour */
  function isJour() {
    return (
      document.body.classList.contains('mode-jour') ||
      document.documentElement.getAttribute('data-theme') === 'light'
    );
  }

  /* Crée une particule */
  function createParticle(type) {
    const p = document.createElement('div');
    p.className = 'bio-particle';
    p.setAttribute('data-type', type);

    const dur   = 10 + Math.random() * 14;     /* 10s à 24s */
    const delay = -(Math.random() * dur);       /* départ échelonné */
    const dx    = (Math.random() * 100 - 50);  /* -50px à +50px */

    p.style.setProperty('--sp-dur',   dur + 's');
    p.style.setProperty('--sp-delay', delay + 's');
    p.style.setProperty('--sp-dx',    dx + 'px');
    p.style.left   = Math.random() * 100 + 'vw';
    p.style.bottom = Math.random() * 20 + 'vh';

    return p;
  }

  /* Retire toutes les particules existantes */
  function clearParticles() {
    particles.forEach(p => p.parentNode && p.parentNode.removeChild(p));
    particles = [];
  }

  /* Spawne les particules selon le mode actuel */
  function spawnParticles() {
    clearParticles();
    const types = isJour() ? JOUR_TYPES : NUIT_TYPES;

    for (let i = 0; i < COUNT; i++) {
      const type = types[i % types.length];
      const p = createParticle(type);
      document.body.appendChild(p);
      particles.push(p);
    }
  }

  /* Lance au DOMContentLoaded */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', spawnParticles);
  } else {
    spawnParticles();
  }

  /* Réagit aux changements de mode via MutationObserver */
  const observer = new MutationObserver(function (mutations) {
    for (const m of mutations) {
      if (
        m.type === 'attributes' &&
        (m.attributeName === 'class' || m.attributeName === 'data-theme')
      ) {
        /* Petit délai pour laisser le CSS commuter avant de respawner */
        clearTimeout(observer._timer);
        observer._timer = setTimeout(spawnParticles, 300);
        break;
      }
    }
  });

  observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

})();
