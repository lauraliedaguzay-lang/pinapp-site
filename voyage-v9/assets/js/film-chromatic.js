/**
 * Pinapp V9 — Film chromatic (voyage-v9)
 * #pinapp-film + data-active-section (films-first V9)
 */
(function () {
  'use strict';

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var ALIAS = {
    hero: 's0',
    'hook-film': 's0',
    orientation: 's1',
    diagnostic: 's3',
    duo: 's1',
    'pourquoi-moins-cher': 's3',
    auto: 's4',
    'auto-faq': 's4',
    pack: 's5',
    realisations: 's5b',
    'realisations-vitrine': 's5b',
    'realisations-demos': 's5b',
    'realisations-stack': 's5b',
    'realisations-films': 's5b',
    'cinema-artistes': 's6',
    'captation-na': 's6',
    s09b: 's7',
    methode: 's7',
    'methode-formations': 's7',
    'methode-tarifs': 's8',
    mp: 's5',
    contact: 's8'
  };

  var HUE_MAP = {
    s0: 0,
    s1: -2,
    s2: 4,
    s3: 8,
    s4: 10,
    s5: -4,
    s5b: -6,
    s6: -12,
    s7: 6,
    s8: -6
  };

  var film = null;
  var currentHue = 0;

  function applyHue(targetHue) {
    if (!film) return;
    if (targetHue === currentHue) return;
    film.style.setProperty('--film-hue-shift', targetHue + 'deg');
    currentHue = targetHue;
  }

  function setScene(sectionId) {
    var sid = ALIAS[sectionId] || sectionId;
    var shift = HUE_MAP[sid];
    if (typeof shift !== 'number') return;
    applyHue(shift);
  }

  function boot() {
    film = document.getElementById('pinapp-film');
    if (!film) return;
    if (document.documentElement.classList.contains('sober')) return;

    document.addEventListener('voyage:scene-active', function (e) {
      if (e && e.detail && e.detail.sectionId) setScene(e.detail.sectionId);
    });

    if ('MutationObserver' in window) {
      var mo = new MutationObserver(function (muts) {
        for (var i = 0; i < muts.length; i++) {
          if (muts[i].type === 'attributes' && muts[i].attributeName === 'data-active-section') {
            var val = document.documentElement.getAttribute('data-active-section');
            if (val) setScene(val);
          }
        }
      });
      mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-active-section'] });
    }

    var cur = document.documentElement.getAttribute('data-active-section');
    if (cur) setScene(cur);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
