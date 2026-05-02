/**
 * Pinapp V12 — easter egg footer : maintien pour révéler les raccourcis sections
 */
(function () {
  'use strict';
  var trigger = document.querySelector('[data-easter-egg]');
  var stones = document.getElementById('easter-egg-stones');
  if (!trigger || !stones) return;

  var STORAGE_KEY = 'pinapp_easter_egg_found';
  var timer = null;
  var touchTimer = null;

  function reveal() {
    stones.classList.add('is-revealed');
    stones.setAttribute('aria-hidden', 'false');
    try {
      localStorage.setItem(STORAGE_KEY, '1');
    } catch (e) {}
  }

  function clearTimers() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    if (touchTimer) {
      clearTimeout(touchTimer);
      touchTimer = null;
    }
  }

  function armHoverFocus() {
    clearTimers();
    timer = setTimeout(reveal, 3000);
  }

  trigger.addEventListener('mouseenter', armHoverFocus);
  trigger.addEventListener('mouseleave', clearTimers);
  trigger.addEventListener('focus', armHoverFocus);
  trigger.addEventListener('blur', clearTimers);

  trigger.addEventListener(
    'touchstart',
    function () {
      clearTimers();
      touchTimer = setTimeout(reveal, 2000);
    },
    { passive: true },
  );
  trigger.addEventListener('touchend', clearTimers);
  trigger.addEventListener('touchcancel', clearTimers);

  stones.addEventListener('click', function (e) {
    var s = e.target.closest('.stone');
    if (!s) return;
    var sec = s.getAttribute('data-section');
    if (!sec) return;
    var el = document.querySelector(sec);
    if (!el || typeof el.scrollIntoView !== 'function') return;
    el.scrollIntoView({ behavior: 'auto', block: 'start' });
  });

  try {
    if (localStorage.getItem(STORAGE_KEY) === '1') {
      stones.classList.add('is-revealed');
      stones.setAttribute('aria-hidden', 'false');
    }
  } catch (e2) {}
})();
