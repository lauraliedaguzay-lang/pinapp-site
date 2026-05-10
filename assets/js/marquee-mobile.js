/**
 * Pinapp V11 — marquees : pause courte au touch (mobile) pour lire
 */
(function () {
  'use strict';
  document.querySelectorAll('.marquee__track').forEach(function (track) {
    var par = track.closest('.marquee');
    if (!par) return;
    var resumeTimer = 0;
    function pauseM() {
      if (resumeTimer) clearTimeout(resumeTimer);
      par.classList.add('is-paused');
    }
    function releaseM() {
      if (resumeTimer) clearTimeout(resumeTimer);
      resumeTimer = window.setTimeout(function () {
        par.classList.remove('is-paused');
      }, 2200);
    }
    track.addEventListener('touchstart', pauseM, { passive: true });
    track.addEventListener('touchend', releaseM, { passive: true });
  });
})();
