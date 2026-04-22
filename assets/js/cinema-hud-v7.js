/*
 * PINAPP V8.2 — Cinema HUD V7 (vanilla)
 * ────────────────────────────────────────────────────────────────
 * Port de l'ambiance cinéma du prototype React v7 en vanilla pur.
 *
 * Ce module fournit :
 *   1. Letterbox top+bottom (classe .is-cinema sur <html> after 40% scroll)
 *   2. Timecode HUD "REC · 00:MM:SS:FF · CH XX" fixed top-left
 *      (24 fps basé sur scroll% × 62.83s = durée film V6)
 *   3. SceneRail 9 dots verticaux middle-right (IntersectionObserver)
 *      + navigation click (via Lenis si dispo)
 *   4. Curseur signature unifié : dot cyan + ring doré lerpé + hover cyan
 *      + label contextuel (Voir/Plein écran) + timecode MM:SS/MM:SS
 *      qui lit window.__pinappFilm
 *
 * Remplace les 4 scripts cursor précédents (archivés en archive/js/).
 * Coexiste avec scene-counter.js (01/08 slot-machine) qui lit voyage:scene-active.
 *
 * Garde-fous :
 *   · prefers-reduced-motion → bail early
 *   · voyage-sober → bail early
 *   · hover:none (mobile) → pas de cursor system (HUD + rail OK)
 *   · low-perf (hardwareConcurrency < 4) → ring doré désactivé
 *   · document.hidden → rAF déjà throttled par browser
 * ────────────────────────────────────────────────────────────────
 */

(function () {
  'use strict';

  // ─── Guards ───────────────────────────────────────────────────
  var reduced = false;
  try { reduced = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  if (reduced) return;
  if (document.documentElement.classList.contains('voyage-sober')) return;

  var hc = typeof navigator.hardwareConcurrency === 'number' ? navigator.hardwareConcurrency : 8;
  var lowPerf = hc < 4;

  var canHover = false;
  try { canHover = matchMedia('(hover: hover) and (pointer: fine)').matches; } catch (e) {}

  // ─── SCENES (mapping v7 scene → prod section id) ──────────────
  var SCENES = [
    { id: 'top',           num: 1, label: 'Ouverture',      targetId: 's0' },
    { id: 'pilotes',       num: 2, label: 'Les pilotes',    targetId: 's2' },
    { id: 'services',      num: 3, label: 'Quatre métiers', targetId: 's3' },
    { id: 'constellation', num: 4, label: 'La constellation', targetId: 's4' },
    { id: 'preuves',       num: 5, label: 'Les preuves',    targetId: 's5' },
    { id: 'mecanisme',     num: 6, label: 'Le mécanisme',   targetId: 's5b' },
    { id: 'manifeste',     num: 7, label: 'Le manifeste',   targetId: 's6' },
    { id: 'realisations',  num: 8, label: "L'œuvre",        targetId: 's7' },
    { id: 'contact',       num: 9, label: 'Atterrissage',   targetId: 's8' }
  ];

  var TOTAL_FILM_SEC = 62.83;
  var FPS = 24;

  // ─── DOM injection ────────────────────────────────────────────
  function injectLetterbox() {
    if (document.querySelector('.cinema-letterbox--top')) return;
    var top = document.createElement('div');
    top.className = 'cinema-letterbox cinema-letterbox--top';
    top.setAttribute('aria-hidden', 'true');
    var bot = document.createElement('div');
    bot.className = 'cinema-letterbox cinema-letterbox--bottom';
    bot.setAttribute('aria-hidden', 'true');
    document.body.appendChild(top);
    document.body.appendChild(bot);
  }

  function injectTimecodeHud() {
    if (document.querySelector('.cinema-timecode')) return;
    var hud = document.createElement('div');
    hud.className = 'cinema-timecode';
    hud.setAttribute('aria-hidden', 'true');
    hud.innerHTML =
      '<span class="rec-dot"></span>' +
      '<span>REC</span>' +
      '<span id="cinema-tc-value">00:00:00:00</span>' +
      '<span style="opacity:.45">·</span>' +
      '<span id="cinema-tc-scene">CH 01</span>';
    document.body.appendChild(hud);
  }

  function injectSceneRail() {
    if (document.querySelector('.scene-rail')) return;
    var rail = document.createElement('nav');
    rail.className = 'scene-rail';
    rail.setAttribute('aria-label', 'Navigation des scènes');
    SCENES.forEach(function (s) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'scene-rail__dot';
      btn.setAttribute('data-scene-target', s.id);
      btn.setAttribute('aria-label', s.num + ' · ' + s.label);
      btn.setAttribute('title', s.num + ' · ' + s.label);
      btn.addEventListener('click', function () { goToScene(s.id); });
      rail.appendChild(btn);
    });
    document.body.appendChild(rail);
  }

  function getLenis() {
    return window.__VOYAGE_LENIS__ || window.__PINAPP_LENIS__ || window.__lenis || null;
  }

  function goToScene(sceneId) {
    var scene = SCENES.find(function (s) { return s.id === sceneId; });
    if (!scene) return;
    var el = document.querySelector('[data-scene="' + sceneId + '"]') ||
             document.getElementById(scene.targetId);
    if (!el) return;
    var lenis = getLenis();
    if (lenis && typeof lenis.scrollTo === 'function') {
      try { lenis.scrollTo(el, { offset: -20 }); return; } catch (e) {}
    }
    var y = el.getBoundingClientRect().top + window.pageYOffset - 20;
    try { window.scrollTo({ top: y, behavior: 'smooth' }); }
    catch (e) { window.scrollTo(0, y); }
  }

  // ─── Cursor unifié ────────────────────────────────────────────
  function injectCursor() {
    if (!canHover) return;
    if (document.querySelector('.pp-cursor-dot')) return;

    document.documentElement.classList.add('pp-cursor-ready');

    var dot = document.createElement('div');
    dot.className = 'pp-cursor-dot';
    dot.setAttribute('aria-hidden', 'true');
    var ring = document.createElement('div');
    ring.className = 'pp-cursor-ring';
    ring.setAttribute('aria-hidden', 'true');
    var label = document.createElement('div');
    label.className = 'pp-cursor-label';
    label.setAttribute('aria-hidden', 'true');
    var tc = document.createElement('div');
    tc.className = 'pp-cursor-timecode';
    tc.setAttribute('aria-hidden', 'true');
    tc.textContent = '00:00 / 00:00';

    document.body.appendChild(dot);
    document.body.appendChild(ring);
    document.body.appendChild(label);
    document.body.appendChild(tc);

    if (lowPerf) ring.style.display = 'none';

    var tx = 0, ty = 0, rx = 0, ry = 0;
    var LERP = 0.18;
    var hovering = false;
    var visible = false;

    function onMove(e) {
      tx = e.clientX;
      ty = e.clientY;
      dot.style.transform = 'translate(' + tx + 'px,' + ty + 'px)';
      label.style.transform = 'translate(' + (tx + 14) + 'px,' + (ty + 18) + 'px)';
      tc.style.transform = 'translate(' + (tx + 22) + 'px,' + (ty + 38) + 'px)';

      if (!visible) {
        dot.style.opacity = '1';
        if (!lowPerf) ring.style.opacity = '1';
        visible = true;
      }

      var target = e.target && e.target.closest ?
        e.target.closest('a, button, [role="button"], [data-cursor="view"]') : null;
      var isHover = !!target;
      if (isHover !== hovering) {
        hovering = isHover;
        ring.classList.toggle('is-hover', hovering);
        var lbl = '';
        if (hovering) {
          if (target.matches('[data-cursor="view"]')) lbl = 'Voir';
          else if (target.matches('iframe[src*="vimeo"], [data-cursor="vimeo"]')) lbl = 'Plein écran';
        }
        if (lbl) { label.textContent = lbl; label.classList.add('is-visible'); }
        else label.classList.remove('is-visible');
      }
    }

    addEventListener('mousemove', onMove, { passive: true });
    addEventListener('mouseleave', function () {
      visible = false;
      dot.style.opacity = '0';
      ring.style.opacity = '0';
      label.classList.remove('is-visible');
      tc.classList.remove('is-visible');
    });
    addEventListener('mouseenter', function () {
      visible = true;
      dot.style.opacity = '1';
      if (!lowPerf) ring.style.opacity = '1';
    });

    if (!lowPerf) {
      (function ringLoop() {
        rx += (tx - rx) * LERP;
        ry += (ty - ry) * LERP;
        ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px)';
        requestAnimationFrame(ringLoop);
      })();
    }

    // Timecode cursor (lit window.__pinappFilm exposé par pinapp-film-v6.js)
    var lastTc = '';
    function fmt(s) {
      if (!isFinite(s) || s < 0) s = 0;
      var m = Math.floor(s / 60), sec = Math.floor(s % 60);
      return (m < 10 ? '0' : '') + m + ':' + (sec < 10 ? '0' : '') + sec;
    }
    setInterval(function () {
      try {
        var f = window.__pinappFilm;
        if (!f || !f.getCurrentTime || !f.getDuration) { tc.classList.remove('is-visible'); return; }
        var cur = f.getCurrentTime(), dur = f.getDuration();
        if (!isFinite(cur) || !isFinite(dur) || dur <= 0) { tc.classList.remove('is-visible'); return; }
        var text = fmt(cur) + ' / ' + fmt(dur);
        if (text !== lastTc) { tc.textContent = text; lastTc = text; }
        if (visible && !tc.classList.contains('is-visible')) tc.classList.add('is-visible');
      } catch (e) {}
    }, 120);
  }

  // ─── Scene tracking (SceneRail + timecode CH) ────────────────
  function initSceneTracking() {
    var els = document.querySelectorAll('[data-scene]');
    if (!els.length) return;

    var activeId = 'top';
    function updateActive(id) {
      if (id === activeId) return;
      activeId = id;
      document.documentElement.setAttribute('data-scene-v7', id);
      // Update rail dots
      document.querySelectorAll('.scene-rail__dot').forEach(function (d) {
        d.classList.toggle('is-active', d.getAttribute('data-scene-target') === id);
      });
      // Update timecode CH label
      var scene = SCENES.find(function (s) { return s.id === id; });
      var chEl = document.getElementById('cinema-tc-scene');
      if (chEl && scene) chEl.textContent = 'CH ' + String(scene.num).padStart(2, '0');
    }

    if (!('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      // Prend l'entrée avec le plus grand intersectionRatio parmi celles isIntersecting
      var best = null;
      entries.forEach(function (e) {
        if (e.isIntersecting && e.intersectionRatio > 0.35) {
          if (!best || e.intersectionRatio > best.intersectionRatio) best = e;
        }
      });
      if (best) updateActive(best.target.dataset.scene);
    }, { threshold: [0.35, 0.5, 0.75] });

    els.forEach(function (el) { io.observe(el); });
  }

  // ─── Cinema mode + timecode value (scroll-driven) ────────────
  function initCinemaMode() {
    var ticking = false;
    function update() {
      ticking = false;
      var y = window.scrollY || window.pageYOffset || 0;
      var threshold = window.innerHeight * 0.4;
      if (y > threshold) document.documentElement.classList.add('is-cinema');
      else document.documentElement.classList.remove('is-cinema');

      var tcEl = document.getElementById('cinema-tc-value');
      if (tcEl) {
        var maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        var pct = maxScroll > 0 ? Math.min(1, Math.max(0, y / maxScroll)) : 0;
        var elapsed = pct * TOTAL_FILM_SEC;
        var m = Math.floor(elapsed / 60);
        var s = Math.floor(elapsed % 60);
        var f = Math.floor((elapsed - Math.floor(elapsed)) * FPS);
        tcEl.textContent =
          '00:' + String(m).padStart(2, '0') +
          ':' + String(s).padStart(2, '0') +
          ':' + String(f).padStart(2, '0');
      }
    }
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll, { passive: true });

    var lenis = getLenis();
    if (lenis && typeof lenis.on === 'function') {
      try { lenis.on('scroll', onScroll); } catch (e) {}
    }
    update();
  }

  // ─── JARVIS console logs (déjà dans prod easter-eggs.js — skip) ───
  // Non répété ici pour éviter duplication avec easter-eggs.js existant.

  // ─── Boot ─────────────────────────────────────────────────────
  function boot() {
    injectLetterbox();
    injectTimecodeHud();
    injectSceneRail();
    injectCursor();
    initSceneTracking();
    initCinemaMode();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
