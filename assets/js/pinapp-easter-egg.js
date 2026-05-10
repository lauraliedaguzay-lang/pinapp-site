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
  var wrap = trigger.closest('.footer-easter-wrap') || trigger.parentElement;
  var hintEl = null;
  var hintScheduleTimer = null;
  var hintAutoHideTimer = null;

  function abortHintSchedule() {
    if (hintScheduleTimer) {
      clearTimeout(hintScheduleTimer);
      hintScheduleTimer = null;
    }
  }

  function hideHintVisual() {
    if (hintAutoHideTimer) {
      clearTimeout(hintAutoHideTimer);
      hintAutoHideTimer = null;
    }
    if (!hintEl) return;
    hintEl.classList.remove('is-visible');
    var el = hintEl;
    hintEl = null;
    setTimeout(function () {
      if (el && el.parentNode) el.parentNode.removeChild(el);
    }, 650);
  }

  function shouldSkipHint() {
    try {
      if (localStorage.getItem(STORAGE_KEY) === '1') return true;
    } catch (e) {}
    return stones.classList.contains('is-revealed');
  }

  function scheduleHintTooltip() {
    if (shouldSkipHint()) return;
    hintScheduleTimer = setTimeout(function () {
      hintScheduleTimer = null;
      if (shouldSkipHint() || !wrap) return;
      hintEl = document.createElement('span');
      hintEl.className = 'easter-egg-hint';
      hintEl.setAttribute('aria-hidden', 'true');
      hintEl.textContent = 'Maintenez 3s';
      wrap.insertBefore(hintEl, trigger);
      requestAnimationFrame(function () {
        if (hintEl) hintEl.classList.add('is-visible');
      });
      hintAutoHideTimer = setTimeout(function () {
        hintAutoHideTimer = null;
        hideHintVisual();
      }, 4000);
    }, 8000);
  }

  function dismissHintIfVisible() {
    if (hintEl) hideHintVisual();
  }

  function reveal() {
    abortHintSchedule();
    hideHintVisual();
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
  trigger.addEventListener('mouseenter', dismissHintIfVisible);
  trigger.addEventListener('mouseleave', clearTimers);
  trigger.addEventListener('focus', armHoverFocus);
  trigger.addEventListener('focus', dismissHintIfVisible);
  trigger.addEventListener('blur', clearTimers);

  trigger.addEventListener(
    'touchstart',
    function () {
      dismissHintIfVisible();
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
    } else {
      scheduleHintTooltip();
    }
  } catch (e2) {
    scheduleHintTooltip();
  }
})();
