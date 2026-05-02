/**
 * PR-H · six pierres (couleurs canoniques) — pas de marque tiers dans le libellé visible
 */
(function () {
  'use strict';

  var trigger = document.querySelector('[data-easter-egg]');
  var stones = document.getElementById('easter-egg-stones');
  if (!trigger || !stones) return;

  var STORAGE_KEY = 'pinapp_easter_egg_found';

  function prefersReduced() {
    try {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (e) {
      return false;
    }
  }

  function reveal() {
    stones.classList.add('is-revealed');
    try {
      localStorage.setItem(STORAGE_KEY, '1');
    } catch (e) {}
  }

  var hoverTimer = null;
  var focusTimer = null;

  function clearHover() {
    if (hoverTimer) {
      clearTimeout(hoverTimer);
      hoverTimer = null;
    }
  }
  function clearFocus() {
    if (focusTimer) {
      clearTimeout(focusTimer);
      focusTimer = null;
    }
  }

  if (prefersReduced()) {
    trigger.addEventListener(
      'click',
      function () {
        reveal();
      },
      { passive: true },
    );
  } else {
    trigger.addEventListener('mouseenter', function () {
      clearHover();
      hoverTimer = setTimeout(reveal, 3000);
    });
    trigger.addEventListener('mouseleave', clearHover);

    var touchTimer = null;
    trigger.addEventListener(
      'touchstart',
      function () {
        if (touchTimer) clearTimeout(touchTimer);
        touchTimer = setTimeout(function () {
          reveal();
          touchTimer = null;
        }, 2000);
      },
      { passive: true },
    );
    trigger.addEventListener('touchend', function () {
      if (touchTimer) {
        clearTimeout(touchTimer);
        touchTimer = null;
      }
    });

    trigger.addEventListener('focus', function () {
      clearFocus();
      focusTimer = setTimeout(reveal, 3000);
    });
    trigger.addEventListener('blur', clearFocus);
  }

  stones.addEventListener('click', function (e) {
    var stone = e.target && e.target.closest ? e.target.closest('.stone') : null;
    if (!stone) return;
    var sec = stone.getAttribute('data-section');
    if (!sec) return;
    var el = document.querySelector(sec);
    if (el && typeof el.scrollIntoView === 'function') {
      el.scrollIntoView({ behavior: 'auto', block: 'start' });
    }
  });

  try {
    if (localStorage.getItem(STORAGE_KEY) === '1') {
      stones.classList.add('is-revealed');
    }
  } catch (e2) {}
})();
