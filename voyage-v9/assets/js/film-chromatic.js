/**
 * Pinapp V9 — Film chromatic (voyage-v9)
 * #pinapp-film + data-active-section (ids s01…s13, interstitiels)
 */
(function () {
  'use strict';

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var ALIAS = {
    s01: 's0',
    s02: 's1',
    s03: 's3',
    s04: 's4',
    s04c: 's4',
    s04b: 's4',
    'pack-duo': 's5',
    'memoire-presence': 's5',
    'demo-showcase': 's5b',
    s06: 's5b',
    s06b: 's5b',
    s07: 's6',
    s08: 's7',
    s09: 's8',
    s09b: 's8',
    s10: 's8',
    s11: 's8',
    s12: 's8',
    form: 's8'
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
