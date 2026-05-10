/**
 * Pinapp V12 — compteurs #comparatif (IntersectionObserver + rAF)
 */
(function () {
  'use strict';
  var counters = document.querySelectorAll('#comparatif [data-counter]');
  if (!counters.length) return;

  var reduce = false;
  try {
    reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e) {}

  function animate(el) {
    var target = parseInt(el.getAttribute('data-counter') || '0', 10);
    if (reduce || !isFinite(target)) {
      el.textContent = String(target);
      return;
    }
    var duration = 1200;
    var start = performance.now();
    function tick(now) {
      var p = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = String(Math.floor(target * eased));
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = String(target);
    }
    requestAnimationFrame(tick);
  }

  if (!('IntersectionObserver' in window)) {
    counters.forEach(function (c) {
      animate(c);
    });
    return;
  }

  var io = new IntersectionObserver(
    function (entries) {
      for (var i = 0; i < entries.length; i++) {
        var e = entries[i];
        if (e.isIntersecting) {
          animate(e.target);
          io.unobserve(e.target);
        }
      }
    },
    { threshold: 0.5 },
  );

  counters.forEach(function (c) {
    io.observe(c);
  });
})();
