/**
 * Pinapp V6.0 — scroll-scrub : progression du scroll → currentTime du film unique.
 */
(function () {
  'use strict';

  var film = document.getElementById('pinapp-film');
  if (!film || !document.documentElement.classList.contains('voyage-v60-film')) return;

  var reduced = false;
  try {
    reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e) {}
  var reducedData = false;
  try {
    reducedData = window.matchMedia('(prefers-reduced-data: reduce)').matches;
  } catch (e2) {}

  if (reduced || reducedData) {
    try {
      film.removeAttribute('src');
      film.remove();
      var overlay = document.querySelector('.pinapp-film-overlay');
      if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
    } catch (e3) {}
    return;
  }

  function kickstart() {
    var p;
    try {
      p = film.play();
    } catch (e4a) {}
    if (p && typeof p.then === 'function') {
      p.then(
        function () {
          try {
            film.pause();
          } catch (e4) {}
        },
        function () {}
      );
    } else {
      try {
        film.pause();
      } catch (e4b) {}
    }
    document.removeEventListener('touchstart', kickstart);
    document.removeEventListener('click', kickstart);
  }
  document.addEventListener('touchstart', kickstart, { once: true, passive: true });
  document.addEventListener('click', kickstart, { once: true });

  var filmDuration = 0;
  var scrollTarget = 0;
  var currentTime = 0;
  var rafId = null;
  var isReady = false;
  var LERP_FACTOR = 0.12;
  var MIN_DELTA = 0.02;

  var main = document.getElementById('voyage-main') || document.querySelector('main') || document.body;

  function computeScrollProgress() {
    var scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
    var docEl = document.documentElement;
    var maxScroll = Math.max(1, (docEl.scrollHeight || main.scrollHeight) - window.innerHeight);
    var p = scrollTop / maxScroll;
    if (p < 0) p = 0;
    if (p > 1) p = 1;
    return p;
  }

  function updateTarget() {
    if (!isReady || !filmDuration) return;
    scrollTarget = computeScrollProgress() * filmDuration;
  }

  function tick() {
    if (!isReady) {
      rafId = window.requestAnimationFrame(tick);
      return;
    }
    var delta = scrollTarget - currentTime;
    if (Math.abs(delta) > MIN_DELTA) {
      currentTime += delta * LERP_FACTOR;
      if (currentTime < 0) currentTime = 0;
      if (currentTime > filmDuration) currentTime = filmDuration;
      try {
        film.currentTime = currentTime;
      } catch (e5) {}
    }
    rafId = window.requestAnimationFrame(tick);
  }

  function onMetadataLoaded() {
    filmDuration = film.duration;
    if (!Number.isFinite(filmDuration) || filmDuration <= 0) {
      return;
    }
    isReady = true;
    updateTarget();
    currentTime = scrollTarget;
    try {
      film.currentTime = currentTime;
    } catch (e6) {}
    try {
      film.pause();
    } catch (e7) {}
  }

  if (film.readyState >= 1) {
    onMetadataLoaded();
  } else {
    film.addEventListener('loadedmetadata', onMetadataLoaded, { once: true });
  }

  window.addEventListener('scroll', updateTarget, { passive: true });
  window.addEventListener('resize', updateTarget, { passive: true });

  if (window.__VOYAGE_LENIS__ && typeof window.__VOYAGE_LENIS__.on === 'function') {
    window.__VOYAGE_LENIS__.on('scroll', updateTarget);
  }

  rafId = window.requestAnimationFrame(tick);

  window.addEventListener(
    'beforeunload',
    function () {
      if (rafId) window.cancelAnimationFrame(rafId);
    },
    { passive: true }
  );

  window.__pinappFilm = {
    film: film,
    getCurrentTime: function () {
      return film.currentTime;
    },
    getDuration: function () {
      return filmDuration;
    },
    getScrollProgress: computeScrollProgress,
  };
})();
