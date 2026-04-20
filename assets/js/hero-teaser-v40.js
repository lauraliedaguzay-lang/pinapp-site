/**
 * V4.0 — hero circular teaser: unmute toggle + click opens presentation modal.
 */
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var wrap = document.querySelector('.hero-teaser');
    if (!wrap) return;
    var video = wrap.querySelector('.hero-teaser-video');
    var unmute = wrap.querySelector('.hero-teaser-unmute');
    var holo = document.getElementById('holo-presentation-trigger');

    if (unmute && video) {
      unmute.addEventListener('click', function (e) {
        e.stopPropagation();
        video.muted = !video.muted;
        unmute.setAttribute(
          'aria-label',
          video.muted ? 'Activer le son du teaser' : 'Couper le son du teaser'
        );
      });
    }

    wrap.addEventListener('click', function () {
      if (holo) holo.click();
    });

    wrap.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (holo) holo.click();
      }
    });
  });
})();
