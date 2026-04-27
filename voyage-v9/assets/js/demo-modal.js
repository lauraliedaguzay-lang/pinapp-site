/**
 * Pinapp V12-A.5 — ouverture modale via [data-demo] (délègue à window.PinappOpenDataDemo)
 */
(function () {
  'use strict';
  var open = typeof window.PinappOpenDataDemo === 'function' ? window.PinappOpenDataDemo : null;
  if (!open) return;
  document.querySelectorAll('[data-demo]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      var slug = el.getAttribute('data-demo');
      if (slug) open(slug);
    });
  });
})();
