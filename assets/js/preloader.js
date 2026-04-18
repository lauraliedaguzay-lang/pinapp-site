/**
 * Pinapp — intro « Le voile qui s'ouvre » (2,5 s) : lentille centrale + voile.
 * Émet `pp:intro:title-reveal` puis `pp:preloader:done` (compat. Lenis / aura / traces).
 */
(function () {
  var INTRO_DURATION = 2500;
  var LENS_GROW_START = 300;
  var LENS_GROW_END = 2000;
  var TITLE_REVEAL_AT = 1200;
  var SAFETY_TIMEOUT = 3500;

  var intro = document.getElementById('pp-intro');
  function emitDoneSoon() {
    window.setTimeout(function () {
      try {
        document.dispatchEvent(new CustomEvent('pp:preloader:done'));
      } catch (eEv) {}
    }, 0);
  }

  if (document.documentElement.classList.contains('pp-intro-skip')) {
    if (intro && intro.parentNode) intro.remove();
    try {
      document.documentElement.classList.remove('pp-intro-active');
    } catch (eSk2) {}
    try {
      sessionStorage.setItem('pp-intro-last-complete', String(Date.now()));
    } catch (eSkS) {}
    emitDoneSoon();
    return;
  }
  if (!intro) {
    emitDoneSoon();
    return;
  }

  var reduced = false;
  try {
    reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (eRm) {}

  var root = document.documentElement;
  var killed = false;
  var startTime = null;

  function targetSize() {
    var w = window.innerWidth || 1024;
    var h = window.innerHeight || 768;
    return Math.sqrt(w * w + h * h);
  }

  function kill() {
    if (killed) return;
    killed = true;
    intro.classList.add('is-done');
    try {
      document.documentElement.classList.remove('pp-intro-active');
    } catch (eRm) {}
    window.setTimeout(function () {
      if (intro.parentNode) intro.remove();
      try {
        document.body.style.overflow = '';
      } catch (eOb2) {}
      try {
        sessionStorage.setItem('pp-intro-last-complete', String(Date.now()));
      } catch (eSkS2) {}
      emitDoneSoon();
    }, 500);
  }

  if (reduced) {
    try {
      root.style.setProperty('--pp-intro-lens-size', '9999px');
    } catch (e2) {}
    window.setTimeout(function () {
      try {
        document.dispatchEvent(new CustomEvent('pp:intro:title-reveal'));
      } catch (e3) {}
    }, 0);
    window.setTimeout(function () {
      try {
        document.documentElement.classList.remove('pp-intro-active');
      } catch (eRm2) {}
    }, 0);
    window.setTimeout(kill, 400);
    return;
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function animate(ts) {
    if (killed) return;
    if (startTime === null) startTime = ts;
    var elapsed = ts - startTime;

    if (elapsed >= LENS_GROW_START && elapsed <= LENS_GROW_END) {
      var t = (elapsed - LENS_GROW_START) / (LENS_GROW_END - LENS_GROW_START);
      var eased = easeOutCubic(Math.min(1, Math.max(0, t)));
      var size = 80 + (targetSize() - 80) * eased;
      try {
        root.style.setProperty('--pp-intro-lens-size', size + 'px');
      } catch (e4) {}
    } else if (elapsed > LENS_GROW_END) {
      try {
        root.style.setProperty('--pp-intro-lens-size', targetSize() + 'px');
      } catch (e5) {}
    }

    if (elapsed >= TITLE_REVEAL_AT && intro.dataset.titleRevealed !== 'true') {
      intro.dataset.titleRevealed = 'true';
      try {
        document.dispatchEvent(new CustomEvent('pp:intro:title-reveal'));
      } catch (e6) {}
    }

    if (elapsed >= INTRO_DURATION) {
      kill();
      return;
    }

    window.requestAnimationFrame(animate);
  }

  window.setTimeout(kill, SAFETY_TIMEOUT);

  try {
    document.body.style.overflow = 'hidden';
  } catch (eOb) {}

  function startAnim() {
    window.requestAnimationFrame(animate);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startAnim);
  } else {
    startAnim();
  }
})();
