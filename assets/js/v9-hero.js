/**
 * Pinapp V9 — Hero immersif (Phase 2)
 * - IntersectionObserver : ajoute `.is-inview` sur chaque scène quand elle entre (≥ 30 %)
 * - Met à jour la pastille chapitre active (.v9-chapters a.is-active) en fonction de la scène visible
 * - Détecte low-perf (hardwareConcurrency < 4) et ajoute .low-perf sur <html>
 * - Respecte prefers-reduced-motion : force .is-inview immédiat sur toutes les scènes (pas de cascade)
 *
 * Vanilla JS, pas de dépendance. ~2 Ko gzip.
 */
(function () {
  'use strict';

  var doc = document;
  var root = doc.documentElement;
  if (!root.classList.contains('v9-hero-page') && !doc.body.classList.contains('v9-hero-page')) return;

  // ---------- prefers-reduced-motion ----------
  var reduced = false;
  try {
    reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e) {}

  // ---------- low-perf detection ----------
  try {
    var cores = navigator.hardwareConcurrency || 4;
    var mem = navigator.deviceMemory || 4;
    if (cores < 4 || mem < 4) root.classList.add('low-perf');
  } catch (e2) {}

  // ---------- Sélecteurs ----------
  var scenes = doc.querySelectorAll('.v9-scene');
  var dots = doc.querySelectorAll('.v9-chapters a');
  if (!scenes.length) return;

  // Map id -> dot
  var dotById = {};
  dots.forEach(function (a) {
    var href = a.getAttribute('href') || '';
    if (href.charAt(0) === '#') dotById[href.slice(1)] = a;
  });

  // ---------- Reduced motion : tout visible d'emblée ----------
  if (reduced) {
    scenes.forEach(function (s) {
      s.classList.add('is-inview');
    });
    // Pastille active : première scène par défaut
    var firstId = scenes[0] && scenes[0].id;
    if (firstId && dotById[firstId]) dotById[firstId].classList.add('is-active');
    return;
  }

  // ---------- IntersectionObserver : reveal à 30% ----------
  var revealIO;
  try {
    revealIO = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-inview');
          }
        });
      },
      { threshold: 0.18, rootMargin: '0px 0px -10% 0px' }
    );
    scenes.forEach(function (s) {
      revealIO.observe(s);
    });
  } catch (e3) {
    // Fallback : tout visible
    scenes.forEach(function (s) {
      s.classList.add('is-inview');
    });
  }

  // ---------- IntersectionObserver : active chapter dot ----------
  // On prend la scène dont la majorité est dans le viewport
  var activeIO;
  try {
    activeIO = new IntersectionObserver(
      function (entries) {
        // On garde la scène la plus visible
        var best = null;
        var bestRatio = 0;
        entries.forEach(function (entry) {
          if (entry.intersectionRatio > bestRatio) {
            best = entry.target;
            bestRatio = entry.intersectionRatio;
          }
        });
        if (best && bestRatio > 0.35) {
          var id = best.id;
          dots.forEach(function (d) {
            d.classList.remove('is-active');
          });
          if (dotById[id]) dotById[id].classList.add('is-active');
        }
      },
      {
        threshold: [0.35, 0.55, 0.75],
        rootMargin: '-10% 0px -10% 0px',
      }
    );
    scenes.forEach(function (s) {
      activeIO.observe(s);
    });
  } catch (e4) {
    // pas grave, le :has(:target) fallback couvre le cas où on clique une pastille
  }

  // ---------- Pastille active au chargement (première scène) ----------
  if (scenes[0] && scenes[0].id && dotById[scenes[0].id]) {
    dotById[scenes[0].id].classList.add('is-active');
  }

  // ---------- Clic pastille : smooth scroll (fallback si Lenis absent) ----------
  dots.forEach(function (a) {
    a.addEventListener('click', function (ev) {
      var href = a.getAttribute('href') || '';
      if (href.charAt(0) !== '#') return;
      var target = doc.getElementById(href.slice(1));
      if (!target) return;
      ev.preventDefault();
      try {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } catch (e5) {
        target.scrollIntoView();
      }
      // Pastille active tout de suite
      dots.forEach(function (d) {
        d.classList.remove('is-active');
      });
      a.classList.add('is-active');
    });
  });
})();
