/* PINAPP — effects-loader.js
   Charge les effets décoratifs uniquement quand ils apportent de la valeur.
   Objectif: perception premium + perf mobile, sans casser la structure existante. */
(function () {
  'use strict';

  function canRun() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;

    // Desktop-only: évite les "faux mobiles" (Playwright) et protège la perf tactile.
    if (!window.matchMedia('(hover: hover)').matches) return false;
    if (!window.matchMedia('(pointer: fine)').matches) return false;
    if ('ontouchstart' in window) return false;
    if (window.innerWidth < 1024) return false;

    return true;
  }

  function load(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = src;
      s.defer = true;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  function run() {
    if (!canRun()) return;
    // Effets décoratifs non essentiels à la conversion.
    // L'ordre évite les dépendances implicites.
    var list = [
      '/assets/js/particles.js',
      '/assets/js/scroll-cinema.js',
      '/assets/js/bio-particles.js',
      '/assets/js/cursor.js',
    ];
    list.reduce(function (p, src) {
      return p.then(function () {
        return load(src);
      });
    }, Promise.resolve());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, { passive: true });
  } else {
    run();
  }

  // Si l'écran change (rotation/tablette), on ne “recharge” pas; c'est volontaire.
})();
