/* ===================================================================
   PINAPP FILM V6.0 - scroll-scrubbed single video controller
   ===================================================================
   Le scroll de la page pilote video.currentTime via requestAnimationFrame
   avec un lerp doux (Apple iPhone Pro pattern).
   Fallback prefers-reduced-motion : film retire, posters statiques via CSS.
   =================================================================== */

(() => {
  'use strict';

  const film = document.getElementById('pinapp-film');
  if (!film) return;

  // Fallback reduced-motion : on ne synchronise pas
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  if (prefersReducedMotion) {
    film.remove();
    return;
  }

  // Safari/iOS : premier play+pause pour debloquer le currentTime seek
  const kickstart = () => {
    film.play().then(() => film.pause()).catch(() => {});
    document.removeEventListener('touchstart', kickstart);
    document.removeEventListener('click', kickstart);
  };
  document.addEventListener('touchstart', kickstart, { once: true, passive: true });
  document.addEventListener('click', kickstart, { once: true });

  let filmDuration = 0;
  let scrollTarget = 0;
  let currentTime = 0;
  let rafId = null;
  let isReady = false;

  const main = document.querySelector('main.voyage')
    || document.querySelector('main')
    || document.body;

  const LERP_FACTOR = 0.1;
  const MIN_DELTA = 0.01;

  function computeScrollProgress() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const maxScroll = main.scrollHeight - window.innerHeight;
    if (maxScroll <= 0) return 0;
    return Math.max(0, Math.min(1, scrollTop / maxScroll));
  }

  function updateTarget() {
    if (!isReady) return;
    const progress = computeScrollProgress();
    scrollTarget = progress * filmDuration;
  }

  function tick() {
    const delta = scrollTarget - currentTime;
    if (Math.abs(delta) > MIN_DELTA) {
      currentTime += delta * LERP_FACTOR;
      currentTime = Math.max(0, Math.min(filmDuration, currentTime));
      try {
        film.currentTime = currentTime;
      } catch (e) {
        // Safari peut throw si seekable range pas encore pret
      }
    }
    rafId = requestAnimationFrame(tick);
  }

  function onMetadataLoaded() {
    filmDuration = film.duration;
    if (!Number.isFinite(filmDuration) || filmDuration <= 0) {
      console.warn('[pinapp-film] Duree film invalide:', filmDuration);
      return;
    }
    isReady = true;
    updateTarget();
    currentTime = scrollTarget;
    try { film.currentTime = currentTime; } catch (e) {}
    tick();
  }

  if (film.readyState >= 1) {
    onMetadataLoaded();
  } else {
    film.addEventListener('loadedmetadata', onMetadataLoaded, { once: true });
  }

  window.addEventListener('scroll', updateTarget, { passive: true });
  window.addEventListener('resize', updateTarget, { passive: true });

  window.addEventListener('beforeunload', () => {
    if (rafId) cancelAnimationFrame(rafId);
  });

  // Debug global (a retirer en prod si besoin)
  window.__pinappFilm = {
    film,
    getCurrentTime: () => film.currentTime,
    getDuration: () => filmDuration,
    getScrollProgress: computeScrollProgress
  };
})();
