/**
 * PINAPP V2 — BIOLUMINESCENCE AVALON
 * JavaScript minimal vanilla — ~4 Ko gzip
 *
 * Features :
 *  1. IntersectionObserver → .is-inview sur chaque scène (reveal cascade)
 *  2. IntersectionObserver → active chapter dot selon scène majoritaire
 *  3. Sticky CTA apparaît après scène 2
 *  4. Cursor custom signature (disc cyan → outline au hover sur interactifs)
 *  5. Parallax 3-couches léger (data-parallax-speed)
 *  6. Smooth scroll click sur pastille (fallback si Lenis absent)
 *  7. Low-perf detection (hardwareConcurrency < 4 || deviceMemory < 4)
 *  8. prefers-reduced-motion : tout désactivé, tout visible
 *
 * Aucune dépendance externe. Pas de CDN. Pas de framework.
 */
(function () {
  'use strict';

  var doc = document;
  var root = doc.documentElement;
  var body = doc.body;

  if (!body || !body.classList.contains('v2-page')) return;

  // ---------- prefers-reduced-motion ----------
  var reduced = false;
  try {
    reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e) {}

  // ---------- Low-perf ----------
  try {
    var cores = navigator.hardwareConcurrency || 4;
    var mem = navigator.deviceMemory || 4;
    if (cores < 4 || mem < 4) root.classList.add('low-perf');
  } catch (e2) {}

  // ---------- Selectors ----------
  var scenes = doc.querySelectorAll('.v2-scene');
  var dots = doc.querySelectorAll('.v2-chapters a');
  var stickyCta = doc.querySelector('.v2-sticky-cta');
  var cursor = doc.querySelector('.v2-cursor');
  var dotById = {};

  dots.forEach(function (a) {
    var href = a.getAttribute('href') || '';
    if (href.charAt(0) === '#') dotById[href.slice(1)] = a;
  });

  // ---------- Reduced motion : tout visible d'emblée ----------
  if (reduced) {
    scenes.forEach(function (s) { s.classList.add('is-inview'); });
    if (scenes[0] && scenes[0].id && dotById[scenes[0].id]) {
      dotById[scenes[0].id].classList.add('is-active');
    }
    if (stickyCta) stickyCta.classList.add('is-visible');
    return;
  }

  // ---------- Reveal IntersectionObserver ----------
  if ('IntersectionObserver' in window) {
    var revealIO = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) entry.target.classList.add('is-inview');
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -8% 0px' }
    );
    scenes.forEach(function (s) { revealIO.observe(s); });
  } else {
    scenes.forEach(function (s) { s.classList.add('is-inview'); });
  }

  // ---------- Active chapter dot ----------
  if ('IntersectionObserver' in window) {
    var activeIO = new IntersectionObserver(
      function (entries) {
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
          dots.forEach(function (d) { d.classList.remove('is-active'); });
          if (dotById[id]) dotById[id].classList.add('is-active');

          // Sticky CTA visible à partir de scène 2
          if (stickyCta) {
            var idx = parseInt((id.match(/\d+/) || [0])[0], 10);
            if (idx >= 2 && idx < 6) stickyCta.classList.add('is-visible');
            else stickyCta.classList.remove('is-visible');
          }
        }
      },
      { threshold: [0.35, 0.55, 0.75], rootMargin: '-10% 0px -10% 0px' }
    );
    scenes.forEach(function (s) { activeIO.observe(s); });
  }

  // Pastille active au chargement (première scène)
  if (scenes[0] && scenes[0].id && dotById[scenes[0].id]) {
    dotById[scenes[0].id].classList.add('is-active');
  }

  // ---------- Click pastille : smooth scroll ----------
  dots.forEach(function (a) {
    a.addEventListener('click', function (ev) {
      var href = a.getAttribute('href') || '';
      if (href.charAt(0) !== '#') return;
      var target = doc.getElementById(href.slice(1));
      if (!target) return;
      ev.preventDefault();
      try {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } catch (e3) {
        target.scrollIntoView();
      }
      dots.forEach(function (d) { d.classList.remove('is-active'); });
      a.classList.add('is-active');
    });
  });

  // ---------- Cursor custom (desktop uniquement) ----------
  var hasHover = false;
  try {
    hasHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  } catch (e4) {}

  if (hasHover && cursor && !root.classList.contains('low-perf')) {
    body.classList.add('v2-cursor-on');
    var cx = 0, cy = 0, tx = 0, ty = 0;
    var cursorRAF = null;

    function cursorTick() {
      // Lerp léger pour trail subtil
      cx += (tx - cx) * 0.22;
      cy += (ty - cy) * 0.22;
      cursor.style.transform = 'translate3d(' + cx + 'px,' + cy + 'px,0) translate(-50%,-50%)';
      cursorRAF = window.requestAnimationFrame(cursorTick);
    }

    doc.addEventListener('mousemove', function (ev) {
      tx = ev.clientX;
      ty = ev.clientY;
      if (!cursorRAF) cursorRAF = window.requestAnimationFrame(cursorTick);
    }, { passive: true });

    // Hover sur interactifs → cursor grossit
    var hoverSelector = 'a, button, summary, input, textarea, [role="button"]';
    doc.addEventListener('mouseover', function (ev) {
      var t = ev.target;
      if (t && t.closest && t.closest(hoverSelector)) {
        cursor.classList.add('v2-cursor--hover');
      }
    }, { passive: true });
    doc.addEventListener('mouseout', function (ev) {
      var t = ev.target;
      if (t && t.closest && t.closest(hoverSelector)) {
        cursor.classList.remove('v2-cursor--hover');
      }
    }, { passive: true });

    // Hide cursor when leaving window
    doc.addEventListener('mouseleave', function () {
      cursor.style.opacity = '0';
    }, { passive: true });
    doc.addEventListener('mouseenter', function () {
      cursor.style.opacity = '1';
    }, { passive: true });
  }

  // ---------- Parallax 3-couches léger (sur data-parallax-speed) ----------
  // Actif sur desktop seulement, sans scroll lib
  var parallaxEls = doc.querySelectorAll('[data-parallax-speed]');
  if (parallaxEls.length && hasHover && !root.classList.contains('low-perf')) {
    var lastY = window.scrollY;
    var parallaxRAF = null;

    function parallaxTick() {
      var y = window.scrollY;
      parallaxEls.forEach(function (el) {
        var speed = parseFloat(el.getAttribute('data-parallax-speed')) || 0;
        var rect = el.getBoundingClientRect();
        var center = rect.top + rect.height / 2 - window.innerHeight / 2;
        var offset = center * speed * 0.12;
        el.style.setProperty('--parallax-y', offset.toFixed(1) + 'px');
      });
      parallaxRAF = null;
    }

    window.addEventListener('scroll', function () {
      if (parallaxRAF === null) {
        parallaxRAF = window.requestAnimationFrame(parallaxTick);
      }
    }, { passive: true });

    parallaxTick();
  }

  // ---------- Honeypot form guard ----------
  var forms = doc.querySelectorAll('.v2-form');
  forms.forEach(function (f) {
    f.addEventListener('submit', function (ev) {
      var hp = f.querySelector('.v2-honeypot');
      if (hp && hp.value) {
        ev.preventDefault();
        return false;
      }
      // TODO Phase J11 : webhook n8n POST ici
    });
  });

  // ---------- Log for debugging (removed in prod build) ----------
  if (window.__PINAPP_DEBUG__) {
    console.info('[v2] Initialised · scenes:', scenes.length, '· reduced:', reduced, '· low-perf:', root.classList.contains('low-perf'));
  }
})();
