/**
 * Pinapp V11 — tilt 3D (≥768px, pointer fine) + RM soft (moins d'amplitude)
 */
(function () {
  'use strict';
  if (!window.matchMedia('(pointer: fine)').matches) return;
  if (window.innerWidth < 768) return;

  var RM = false;
  try {
    RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e) {}

  var amp = RM ? 2 : 5;

  var sel =
    '.orientation-card, .demo-tile, .vimeo-tile, .pinapp-form .path-card, .reals-duo .card--glass';
  var nodes = document.querySelectorAll(sel);
  var i;

  for (i = 0; i < nodes.length; i++) {
    (function (card) {
      card.classList.add('v10-tilt');
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform =
          'perspective(1000px) rotateY(' +
          x * amp +
          'deg) rotateX(' +
          -y * amp +
          'deg) translateZ(6px)';
      });
      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
      });
    })(nodes[i]);
  }
})();
