/**
 * Pinapp V7 — Cursor Cinema Timecode (signature awwards #3)
 * ────────────────────────────────────────────────────────────────
 * Affiche "MM:SS / MM:SS" sous le curseur en permanence quand le film V6
 * est actif. Micro-label Geist Mono tabular-nums, 0.4 opacity.
 *
 * Signe que l'user est DANS un film, pas devant un site.
 * Respecte règle AVATAR : subtile, pas criante.
 *
 * Dépendances :
 *  - window.__pinappFilm exposé par assets/js/pinapp-film-v6.js
 *  - pas de gsap requis (vanilla)
 *
 * Désactivé :
 *  - mobile / touch (pas de cursor)
 *  - voyage-sober
 *  - prefers-reduced-motion
 */
(function () {
  'use strict';

  var mqHover;
  var mqReduce;
  try {
    mqHover = window.matchMedia('(hover: hover)');
    mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  } catch (e) {
    return;
  }

  function formatTime(s) {
    if (!isFinite(s) || s < 0) s = 0;
    var m = Math.floor(s / 60);
    var sec = Math.floor(s % 60);
    return (m < 10 ? '0' : '') + m + ':' + (sec < 10 ? '0' : '') + sec;
  }

  function boot() {
    if (!mqHover.matches) return;
    if (mqReduce.matches) return;
    if (document.documentElement.classList.contains('voyage-sober')) return;
    if (!window.__pinappFilm) return;

    var tc = document.createElement('div');
    tc.id = 'cursor-timecode';
    tc.setAttribute('aria-hidden', 'true');
    tc.textContent = '00:00 / 00:00';
    document.body.appendChild(tc);

    var mouseX = 0, mouseY = 0;
    var visible = false;

    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!visible) {
        tc.classList.add('is-visible');
        visible = true;
      }
      // Suit le curseur avec offset (à droite+dessous)
      tc.style.transform = 'translate3d(' + (mouseX + 22) + 'px, ' + (mouseY + 38) + 'px, 0)';
    }, { passive: true });

    document.addEventListener('mouseleave', function () {
      tc.classList.remove('is-visible');
      visible = false;
    });

    // Update timecode text 10 fois / seconde (évite trashing)
    var lastText = '';
    setInterval(function () {
      try {
        var f = window.__pinappFilm;
        if (!f || !f.getCurrentTime || !f.getDuration) return;
        var cur = f.getCurrentTime();
        var dur = f.getDuration();
        if (!isFinite(cur) || !isFinite(dur) || dur <= 0) return;
        var text = formatTime(cur) + ' / ' + formatTime(dur);
        if (text !== lastText) {
          tc.textContent = text;
          lastText = text;
        }
      } catch (e) {}
    }, 100);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    setTimeout(boot, 0);
  }
})();
