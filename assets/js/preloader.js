/**
 * Pinapp — préchargeur AURA (léger, max 1200 ms, safety)
 * Émet `pp:preloader:done` à la fermeture. Compatible avec #pp-intro (attente fin intro).
 */
(function () {
  var PRELOADER_MAX = 1200;
  var el = document.getElementById('pp-preloader');
  if (!el || !el.classList.contains('pp-preloader--aura-lite')) return;

  var reduced = false;
  try {
    reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (eRm) {}

  var killed = false;
  var safetyId = null;

  function kill() {
    if (killed) return;
    killed = true;
    if (safetyId) {
      clearTimeout(safetyId);
      safetyId = null;
    }
    el.classList.add('pp-preloader--out');
    try {
      document.body.classList.remove('pp-preloader-active');
    } catch (eBody) {}
    window.setTimeout(function () {
      if (el.parentNode) el.remove();
      try {
        document.dispatchEvent(new CustomEvent('pp:preloader:done'));
      } catch (eEv) {}
    }, 560);
  }

  function arm() {
    try {
      document.body.classList.add('pp-preloader-active');
    } catch (e) {}
    safetyId = window.setTimeout(kill, PRELOADER_MAX);
    if (document.readyState === 'complete') {
      window.setTimeout(kill, 380);
    } else {
      window.addEventListener(
        'load',
        function () {
          window.setTimeout(kill, 200);
        },
        { once: true }
      );
    }
  }

  if (reduced) {
    try {
      el.remove();
    } catch (eR) {}
    try {
      document.dispatchEvent(new CustomEvent('pp:preloader:done'));
    } catch (eR2) {}
    return;
  }

  function startWhenReady() {
    var intro = document.getElementById('pp-intro');
    var skipIntro = document.documentElement.classList.contains('pp-intro-skip');
    if (intro && !skipIntro) {
      window.addEventListener(
        'pp-pinapp-intro-done',
        function onIntro() {
          window.removeEventListener('pp-pinapp-intro-done', onIntro);
          arm();
        },
        { once: true }
      );
      return;
    }
    arm();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startWhenReady);
  } else {
    startWhenReady();
  }
})();
